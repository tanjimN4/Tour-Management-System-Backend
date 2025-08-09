import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { DivisionRoutes } from "../modules/division/devision.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { UserRoutes } from "../modules/user/user.route";

export const router =Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
     {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    },
    {
        path:"/booking",
        route:BookingRoutes
    },
    {
        path:"/payment",
        route:PaymentRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})
