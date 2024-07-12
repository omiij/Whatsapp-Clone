/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from 'redux';
import { AppActions } from './types';
import { LOGOUT_SUCCESS, SHOW_GLOBAL_ERROR, SHOW_TOAST, VERIFY_CVL_SUCCESS } from './types/auth';
import en from '../lang/en-us';
import {
  SEND_CONSENTEMAIL_APPROVE_SUCCESS,
  SEND_CONSENTEMAIL_REJECT_SUCCESS,
  UPLOAD_BULK_USERS_SUCCESS,
} from './types/onBoarding';
import { UPLOAD_BULK_FUND_SUCCESS } from './types/funds';

export const CALL_API = 'CALL_API';
export const BASE_URL = process.env.REACT_APP_BASE_URL || '/api';
const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Expires: 0,
};

class AuthError extends Error {}

class APIError extends Error {}

class SlientError extends Error {}
export class fatcaErrors extends Error {}
export class AuthorisedErrors extends Error {}
export class UboErrors extends Error {}
export class BankError extends Error {}
export class RiskProfileErrors extends Error {}
export class NetworkError extends Error {}
export class ERR_INTERNET_DISCONNECTED extends Error {}
interface CustomError {
  error: boolean;
  message: string;
  code: number;
}

export interface ResponseBody<T> {
  type: AppActions;
  body: T;
  error?: any;
}

// interface ApiResBody {
//     data: any;
//     count: number;
//     error: string[];
//     success: boolean;
// }

export interface ResponseType {
  data: any;
  error: null | CustomError;
}

export interface ActionReqType {
  types: string[];
  body?: any;
  enableFixture?: boolean;
  json?: string;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  contentType?: any;
  showToast?: boolean;
  toastMessage?: string;
  params?: any;
  slient?: boolean;
}

async function invokeAPI({
  endpoint,
  token,
  config,
  headerContent,
  enableFixture,
  json,
  contentType,
}: {
  endpoint: string;
  token: string;
  config: any;
  headerContent?: any;
  enableFixture?: boolean;
  json?: string;
  contentType?: any;
}): Promise<ResponseType> {
  const headers = token
    ? { ...DEFAULT_HEADERS, Authorization: `Bearer ${token}` }
    : { ...DEFAULT_HEADERS };
  const updatedConfig = {
    ...config,
    headers: {
      ...headers,
      ...headerContent,
    },
  };
  const url = enableFixture ? `/fixtures/${json}` : `${BASE_URL}${endpoint}`;
  const response = enableFixture ? await fetch(url) : await fetch(url, updatedConfig);

  if (response.status === 401) {
    throw new AuthError(en.networkText.timeOut);
  }

  let body: any;
  if (typeof contentType === 'undefined') {
    body = await response.json();
  } else if (contentType === 'application/pdf') {
    body = await response.blob();
  } else if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    body = await response.blob();
  }

  if (response.status >= 400) {
    const { message } = body || {};
    throw new APIError(message || en.networkText.unableToProcess);
  }

  return { data: body, error: null };
}

export const middleWareDispatch: Middleware = (store) => (next) => async (action) => {
  if (typeof action[CALL_API] === 'undefined') {
    return next(action);
  }
  const { slient = false } = action[CALL_API];
  try {
    const {
      url,
      types,
      body,
      method,
      json,
      enableFixture = false,
      contentType,
      params,
      showToast = false,
      toastMessage = 'Success!',
    }: ActionReqType = action[CALL_API];

    const queryParams = new URLSearchParams();
    for (const param in params) {
      if (params[param]) {
        queryParams.set(param, params[param]);
      }
    }
    const [successType, errorType] = types;
    const {
      auth: { token = '' },
      investor: { token: investorToken = '' },
    } = store.getState();
    const tokenToUse =
      types.includes(SEND_CONSENTEMAIL_APPROVE_SUCCESS) ||
      types.includes(SEND_CONSENTEMAIL_REJECT_SUCCESS) ||
      types.includes(VERIFY_CVL_SUCCESS)
        ? ''
        : token || investorToken;
    const payload = {
      endpoint: url + (params ? '?' + queryParams.toString() : ''),
      token: tokenToUse,
      config: {
        method,
        body:
          types.includes(UPLOAD_BULK_USERS_SUCCESS) || types.includes(UPLOAD_BULK_FUND_SUCCESS)
            ? body
            : JSON.stringify(body),
      },
      enableFixture,
      json,
      contentType,
      headerContent:
        types.includes(UPLOAD_BULK_USERS_SUCCESS) || types.includes(UPLOAD_BULK_FUND_SUCCESS)
          ? { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          : {},
    };
    const { data, error }: ResponseType = await invokeAPI(payload);
    if (showToast) {
      next({
        type: SHOW_TOAST,
        message: toastMessage,
        severity: 'success',
      });
    }
    if (data || !error) {
      next({ type: successType, body: data });
    } else {
      next({ type: errorType, error });
    }
    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      next({ type: LOGOUT_SUCCESS });
      next({ type: SHOW_GLOBAL_ERROR, errorType: 'ALERT', message: en.networkText.timeOut });
    } else if (slient || error instanceof SlientError) {
      throw error;
    } else if (error instanceof APIError) {
      next({ type: SHOW_GLOBAL_ERROR, errorType: 'ALERT', message: (error as Error).message });
      throw error;
    } else if (error instanceof NetworkError || error instanceof ERR_INTERNET_DISCONNECTED) {
      next({
        type: SHOW_GLOBAL_ERROR,
        errorType: 'ALERT',
        message: en.networkText.unableToProcess,
      });
      throw error;
    } else if (error instanceof TypeError) {
      next({
        type: SHOW_GLOBAL_ERROR,
        errorType: 'ALERT',
        message: en.networkText.unableToProcess,
      });
      throw error;
    } else {
      next({
        type: SHOW_GLOBAL_ERROR,
        errorType: 'ALERT',
        message: en.networkText.unableToProcess,
      });
      throw error;
    }
  }
};
