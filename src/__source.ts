export interface SourceItem {
    name: string;
    type: 'root' | 'context' | 'subcontext' | 'feature';
    children: SourceItem[];
}

export const source: SourceItem = {
    name: 'root',
    type: 'root',
    children: [
        {
            name: 'Context 1',
            type: 'context',
            children: [
                // {
                //     name: 'Sub-Context 1.1',
                //     type: 'subcontext',
                //     children: [{ name: 'Sub-Context 1.1', type: 'subcontext', children: [] }],
                // },
            ],
        },
        // {
        //     name: 'Context 2',
        //     type: 'context',
        //     children: [
        //         {
        //             name: 'Sub-Context 2.1 sdfsd fsd fs df',
        //             type: 'subcontext',
        //             children: [
        //                 { name: 'Feature 2.1.1 sdf sdf sdfsdfsd fsd fs df sdf sdf sdf', type: 'feature', children: [] },
        //                 { name: 'Feature 2.1.2', type: 'feature', children: [] },
        //             ],
        //         },
        //         { name: 'feature 2.1', type: 'feature', children: [] },
        //         { name: 'Sub-Context 2.2', type: 'subcontext', children: [] },
        //     ],
        // },
    ],
};
