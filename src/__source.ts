export interface SourceItem {
    name: string;
    type: 'root' | 'context' | 'subcontext' | 'feature';
    children: SourceItem[];
}

export const source: SourceItem = {
    name: 'Conway',
    type: 'root',
    children: [
        {
            name: 'General',
            type: 'context',
            children: [],
        },
        {
            name: 'Acquisition',
            type: 'context',
            children: [
                {
                    name: 'CaptchaErrorContext',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'CaptchaError',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
                {
                    name: 'RequestRequiresCaptcha',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'ExternalReferral',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'OTPErrorContext',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'OTPError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'OTPConfirmEmailPopupError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'OTPConfirmPhonePopupError',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
                {
                    name: 'MFAOTPErrorContext',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'MFAOTPError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'MFAOTPConfirmPhonePopupError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'MFAOTPConfirmEmailPopupError',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
                {
                    name: 'AuthUserErrorContext',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'AuthViaOneTimeCodeError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'AddNewEmailError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'AddNewPhoneError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'ConfirmEmailError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'EditEmailError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'ConfirmPhoneError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'EditPhoneError',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'MergeUsersError',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
                {
                    name: 'AdvCake',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'UserCredentialPage',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'PromocodeActivationByQueryParam',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'AppsFlyer',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'ReferalsCollector',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'BDUI',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'PromocodeLanding',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'Page',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
                {
                    name: 'ArtPromo',
                    type: 'feature',
                    children: [],
                },
                {
                    name: 'ArtBuyCollection',
                    type: 'feature',
                    children: [],
                },
            ],
        },
        {
            name: 'Monetization',
            type: 'context',
            children: [
                {
                    name: 'Payment',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'ValueObject',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'PaymentFacade',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'PaymentEntryPoint',
                            type: 'feature',
                            children: [],
                        },
                        {
                            name: 'PaymentFrame',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            name: 'Navigation',
            type: 'context',
            children: [
                {
                    name: 'BookCard',
                    type: 'feature',
                    children: [],
                },
            ],
        },
        {
            name: 'Loyalty',
            type: 'context',
            children: [
                {
                    name: 'Loyalty',
                    type: 'subcontext',
                    children: [
                        {
                            name: 'BonusesForPayingPpd',
                            type: 'feature',
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
};
