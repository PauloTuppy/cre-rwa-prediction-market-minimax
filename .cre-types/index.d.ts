declare module "@chainlink/cre-sdk" {
    export const cre: {
        workflow: <T = any>(name: string, callback: (runtime: any) => any) => any;
        triggers: {
            evm: {
                EventTrigger: any;
            };
            HTTPTrigger: any;
        };
        capabilities: {
            EVMClient: any;
            HTTPClient: any;
        };
    };
    export type Runtime<T = any> = any;
    export type Context = any;
}
