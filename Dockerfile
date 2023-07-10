# -------------------------------------------------------------------------------------------------
# Builder Image
# -------------------------------------------------------------------------------------------------

FROM node:18.16.1-bookworm AS builder

ENV NODE_ENV production

RUN set -eux \
    && apt-get update && apt-get install -y --no-install-recommends \
    tini \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux \
    && mkdir -p /usr/src/app \
    && chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN set -eux \
    && npm ci --omit=dev \
    && npm cache clean --force

COPY --chown=node:node src ./src

RUN set -eux \
    && npm run build --if-present

# -------------------------------------------------------------------------------------------------
# Production Image
# -------------------------------------------------------------------------------------------------

FROM node:18.16.1-bookworm-slim

ENV NODE_ENV production

COPY --from=builder /usr/bin/tini /usr/bin/tini

RUN set -eux \
    && mkdir -p /opt/app \
    && chown -R node:node /opt/app

USER node

WORKDIR /opt/app

COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/src ./src

EXPOSE 8080

ENTRYPOINT ["tini", "--"]

CMD ["node", "src/server.js"]
