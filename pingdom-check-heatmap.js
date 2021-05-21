async function graphFetcher(graphConfig, context, timeframe, fetcher) {
        return fetcher('graph-custom', graphConfig, context, timeframe);
}

async function pingdomFetcher(pingdomConfig, context, timeframe, fetcher) {
        return fetcher('pingdom', pingdomConfig, context, timeframe);
} 

async function run(config, context, timeframe, fetcher) {
        let data;

        if (context.sourceId && context.sourceName) {
                const sourceName = context.sourceName[0];
                if (sourceName !== 'Pingdom') {
                        return 'Object is not a Pingdom check';
                }
                data = [context];
        } else {
                const limit = config.vars?.limit || 10;
                const gremlinQuery = 'g.V().has("sourceName", sourceName).limit(limit).valueMap(true)';
                const bindings = { sourceName: 'Pingdom', limit };
                const graphConfig = { gremlinQuery, bindings };
                data = await graphFetcher(graphConfig, context, timeframe, fetcher);
        }

        return Promise.all(data.map(async ctx => {
                const pingdomConfig = {
                        id: ctx.sourceId[0]
                        //includeUpTime: true,
                        //resultProp: 'downtime'
                }
                return pingdomFetcher(pingdomConfig, ctx, timeframe, fetcher);
        }));
}
