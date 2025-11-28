import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";

interface User {
    _id: string;
    phone: string;
    name?: string;
    address?: string;
}

interface OrderItem {
    product: {
        _id: string;
        name: string;
        packageSize: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
}

export default component$(() => {
    const state = useStore<{
        user: User | null;
        orders: Order[];
        loading: boolean;
        error: string | null;
    }>({
        user: null,
        orders: [],
        loading: true,
        error: null,
    });

    // بررسی احراز هویت
    useVisibleTask$(async () => {
        try {
            const res = await fetch("http://localhost:5000/api/user/me", {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                state.user = data.user;
            } else {
                // اگر توکن یا کاربر معتبر نبود، ریدایرکت
                window.location.href = "/User"; // مسیر ورود شماره تلفن
            }
        } catch (err) {
            window.location.href = "/User"; // ریدایرکت در صورت خطای ارتباط
        }
    });

    // دریافت سفارشات
    useVisibleTask$(async () => {
        try {
            const res = await fetch("http://localhost:5000/api/user/me/orders", {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                state.orders = data.orders;
            }
        } catch (err) {
            state.error = "خطا در دریافت سفارشات";
        }
        state.loading = false;
    });

    return (
        <div>
            <h1>پروفایل کاربر</h1>

            {state.loading && <p>در حال بارگذاری...</p>}
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}

            {state.user && (
                <>
                    <p>شماره تلفن: {state.user.phone}</p>
                    <p>نام: {state.user.name || "نام وارد نشده"}</p>
                    <p>آدرس: {state.user.address || "آدرس وارد نشده"}</p>
                </>
            )}

            <h2>سفارشات</h2>
            {state.orders.length === 0 && <p>هنوز سفارشی ثبت نکرده‌اید</p>}

            <ul>
                {state.orders.map((order) => (
                    <li key={order._id}>
                        <strong>سفارش #{order._id}</strong>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.product._id}>
                                    {item.product.name} — {item.product.packageSize} —{" "}
                                    {item.quantity} عدد — {item.price} تومان
                                </li>
                            ))}
                        </ul>
                        <p>مبلغ کل: {order.totalPrice} تومان</p>
                        <hr />
                    </li>
                ))}
            </ul>

            <button
                onClick$={async () => {
                    const res = await fetch("http://localhost:5000/api/user/logout", {
                        method: "POST",
                        credentials: "include",
                    });
                    const data = await res.json();
                    if (data.success) {
                        alert("با موفقیت خارج شدید");
                        window.location.href = "/User"; // هدایت به صفحه ورود
                    }
                }}
                style={{ marginTop: "20px", padding: "10px" }}
            >
                خروج از حساب
            </button>
        </div>
    );
});
