/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { combineReducers } from 'redux';
import applicationReducer, { ApplicationStateProps } from './application';
import dashboardDoughnutReducer from './doughnutGraph';
import monthOnMonthReducer from './monthsGraph';
import topDistributorReducer from './topDistributors';
import commitmentAndContributionReducer from './commitmentAndContributionGraph';
import auth from './auth';
import errorReducer, { ErrorState } from './error';
import investorReducer from './investor';
import profileReducer from './profile';
import paramsReducer, { ParamsProps } from './queryParams';
import toast, { ToastType } from './toast';
import {
  dashboardOnboardingType,
  distributorWisecommitmentType,
  monthwiseCommitmentAmountType,
  monthwiseOnboardingSummaryType,
} from '../types/api-types';
export interface RootStateType {
  auth: any;
  router: any;
  profileReducer: any;
  dataDougnut: dashboardOnboardingType;
  monthOnMonthData: monthwiseOnboardingSummaryType;
  topDistributors: distributorWisecommitmentType;
  commitmentAndContributionData: monthwiseCommitmentAmountType;
  application: ApplicationStateProps;
  toast: ToastType;
  investor: any;
  error: ErrorState;
  paramsObj: ParamsProps;
}

export const rootReducer = (history: any) =>
  combineReducers({
    router: history,
    auth,
    profile: profileReducer,
    application: applicationReducer,
    dataDougnut: dashboardDoughnutReducer,
    monthOnMonthData: monthOnMonthReducer,
    commitmentAndContributionData: commitmentAndContributionReducer,
    topDistributors: topDistributorReducer,
    toast,
    investor: investorReducer,
    error: errorReducer,
    paramsObj: paramsReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
