        async function graphFetcher(config, context, timeframe, fetcher, gremlinQuery, bindings) {
            return fetcher('graph-custom', { gremlinQuery, bindings }, context, timeframe);
        }

        async function pingdomFetcher(config, context, timeframe, fetcher) {
            return fetcher('pingdom', config, context, timeframe);
        } 

        async function run(config, context, timeframe, fetcher) {
            let data;
            if (!context.sourceId) {
                const gremlinQuery = 'g.V().has("sourceName", sourceName).limit(10).valueMap(true)';
                const bindings = { sourceName: config.vars.sourceName };
                data = await graphFetcher(config, context, timeframe, fetcher, gremlinQuery, bindings);
                if (sourceName !== 'Pingdom') {
                        return data;
                }
            } else {
                data = [context];
            }
            return Promise.all(data.map(async ctx => {
                const pingdomConfig = {
                        id: ctx.sourceId[0]
                }
                return pingdomFetcher(pingdomConfig, ctx, timeframe, fetcher);
            }));
        }
