import { InventoryService } from '../../services/InventoryService.js';
import { PaymentService } from '../../services/PaymentService.js';
import { ShippingService } from '../../services/ShippingService.js';

class CheckoutFacade {
    constructor() {
        this.inventoryService = new InventoryService();
        this.paymentService = new PaymentService();
        this.shippingService = new ShippingService();
    }

    placeOrder(orderDetails) {
    const { userId, productIds, shippingInfo, amount } = orderDetails;

    if (!this.inventoryService.checkStock(productIds)) {
        console.log('[Checkout] Order stopped: items are out of stock.');
        return false;
    }

    if (!this.paymentService.processPayment(userId, amount)) {
        console.log('[Checkout] Order stopped: payment failed.');
        return false;
    }

    const shipment = this.shippingService.arrangeShipping(userId, shippingInfo);

    if (!shipment) {
        console.log('[Checkout] Order stopped: shipping could not be arranged.');
        return false;
    }

    console.log(`[Checkout] Order placed successfully. Tracking ID: ${shipment.trackingId}`);
    return shipment;
}
}

export { CheckoutFacade };
