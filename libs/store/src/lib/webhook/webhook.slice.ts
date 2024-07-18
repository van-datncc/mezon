import { LoadingStatus } from "@mezon/utils";
import { ApiWebhook } from "mezon-js/api.gen";

export interface IWebHookState {
    loadingStatus: LoadingStatus;
    errors?: string | null;
    webhookList: Array<ApiWebhook>;
}

export const initialWebhookState: IWebHookState ={
    loadingStatus: "not loaded",
    errors: null,
    webhookList: [],
}
