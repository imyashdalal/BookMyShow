import {load} from '@cashfreepayments/cashfree-js';

export const initializePayment = async () => {
    const cashfree = await load({
	    mode: "sandbox" //or production
    });

    return cashfree;
};
