        async function graphFetcher(config, context, timeframe, fetcher, gremlinQuery, bindings) {
            return fetcher('graph-custom', { gremlinQuery, bindings }, context, timeframe);
        }

        async function run(config, context, timeframe, fetcher) {
            const gremlinQuery = 'g.V().has("sourceName", sourceName).count()';
            const bindings = { sourceName: config.vars.sourceName };
            const data = await graphFetcher(config, context, timeframe, fetcher, gremlinQuery, bindings);
            return data;
        }
