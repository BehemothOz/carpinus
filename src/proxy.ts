import { createError } from 'conway-errors';

type ExtendedParams = Record<string, unknown>;

type TreeNodeType = 'context' | 'subcontext' | 'feature';

interface TreeNode<T extends string = string> {
    name: string;
    type: TreeNodeType;
    errorType?: T;
    children: Map<string, TreeNode<T>>;
}

type EnsureNodeParams<T extends string> = {
    parentNode: TreeNode<T>;
    name: string;
    type: TreeNodeType;
    errorType?: T;
    extendedParams?: ExtendedParams;
};

function createTreeNode<T extends string>(name: string, type: TreeNodeType, errorType?: T): TreeNode<T> {
    return {
        name,
        type,
        errorType,
        children: new Map(),
    };
}

function ensureNode<T extends string>(params: EnsureNodeParams<T>): TreeNode<T> {
    const { parentNode, name, type, errorType, extendedParams } = params;

    if (!parentNode.children.has(name)) {
        parentNode.children.set(name, createTreeNode(name, type, errorType));
    }

    return parentNode.children.get(name)!;
}

let globalTree: TreeNode<string> = createTreeNode('root', 'context');

export function proxyCreateError<T extends string>(originalCreateError: typeof createError) {
    const handler: ProxyHandler<typeof originalCreateError> = {
        apply(target, thisArg, args) {
            const [errorTypes, options] = args;

            const proxiedContextCreator = (
                parentNode: TreeNode<T>,
                name: string,
                type: TreeNodeType,
                extendedParams?: ExtendedParams
            ) => {
                const contextNode = ensureNode({
                    parentNode,
                    name,
                    type,
                    extendedParams,
                });

                const originalContext = originalCreateError(errorTypes, options)(name);

                return {
                    subcontext(subcontextName: string, extendedParams?: ExtendedParams) {
                        return proxiedContextCreator(contextNode, subcontextName, 'subcontext', extendedParams);
                    },
                    feature(featureName: string, extendedParams?: ExtendedParams) {
                        const featureNode = ensureNode({
                            parentNode: contextNode,
                            name: featureName,
                            type: 'feature',
                            extendedParams,
                        });

                        return new Proxy(originalContext.feature(featureName, extendedParams), {
                            apply(target, thisArg, args) {
                                const [errorType, message, options] = args;

                                ensureNode({
                                    parentNode: featureNode,
                                    name: errorType,
                                    type: 'feature',
                                    errorType,
                                    extendedParams: options?.extendedParams,
                                });

                                return Reflect.apply(target, thisArg, args);
                            },
                        });
                    },
                };
            };

            return (contextName: string, extendedParams?: ExtendedParams) => {
                return proxiedContextCreator(globalTree, contextName, 'context', extendedParams);
            };
        },
    };

    return new Proxy(originalCreateError, handler);
}
