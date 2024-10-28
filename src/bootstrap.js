import { globalErrorHandling } from "./middleware/globalErrorHandling.js"
import authRouter from "./modules/auth/auth.router.js";
import companyRouter from "./modules/company/company.router.js";
import jobRouter from "./modules/job/job.router.js";
import userRouter from "./modules/user/user.router.js";

export const bootstrap = (app, express) => {
    //parse req
    app.use(express.json())
    // app.use('/uploads', express.static('uploads'))

    //routing
    app.use('/auth', authRouter)
    app.use('/company', companyRouter);
    app.use('/job', jobRouter);
    app.use('/user', userRouter)
    //globalErrorHandling
    app.use(globalErrorHandling)
} 