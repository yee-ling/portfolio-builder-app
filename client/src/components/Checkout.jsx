import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import { toast } from "sonner";
import { toPremium } from "@/api/usersApi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);
  const { user, setUser, fetchUser, logout } = useAuth();
  const router = useRouter();

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: 99 },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      const name = details.payer.name.given_name;
      const result = await toPremium(user._id);

      if (result.success) {
        setUser(result.user);
        toast.success("Payment Success! You are now a premium member.");

        logout();
        router.push("/login");
      } else {
        toast.error(result.msg);
      }
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <select value={currency} onChange={onCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SGD">SGD</option>
          </select>
          <PayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={onCreateOrder}
            onApprove={onApproveOrder}
          />
        </>
      )}
    </div>
  );
}
