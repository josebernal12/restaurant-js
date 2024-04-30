import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_KEY)


const account = await stripe.accounts.create({
    controller: {
        losses: {
            payments: 'application',
        },
        fees: {
            payer: 'application',
        },
        stripe_dashboard: {
            type: 'express',
        },
    },
});

const accountLink = await stripe.accountLinks.create({
    account: process.env.ACCOUNT_ID,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: 'account_onboarding',
});