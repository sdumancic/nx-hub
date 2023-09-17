import { createAction, createReducer, on, props, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export const updateComponentState = createAction(
  '[Component Store] Update Action',
  props<{ componentName; componentState }>()
);

export const initialState: any = {};

export const employeeOverviewComponentStateReducer = createReducer(
  initialState,
  on(updateComponentState, (state, { componentName, componentState }) => {
    return { [componentName]: { ...componentState } };
  })
);

export const linkToGlobalState = (
  componentState$: Observable<any>,
  componentName: string,
  globalStore: Store
) => {
  componentState$
    .pipe(
      distinctUntilChanged(
        (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
      )
    )
    .subscribe((componentState) => {
      globalStore.dispatch(
        updateComponentState({ componentName, componentState })
      );
    });
};
