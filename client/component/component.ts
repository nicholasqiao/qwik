/**
 * @license
 * Copyright a-Qoot All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/a-Qoot/qoot/blob/main/LICENSE
 */

import { QRL } from '../import/qrl.js';
import { QError, qError } from '../error/error.js';
import '../util/qDev.js';

/**
 * Base class for Qoot component.
 *
 * All Qoot components need to inherit from this class. A Qoot component represents transient state
 * of component. A component contains `$state` and `$keyProps` properties.
 *
 * Example:
 * ```
 * interface GreeterState {}
 * interface GreeterProps {
 *   salutation: string,
 *   name: string,
 * }
 *
 * class Greeter extends Component<GreeterProps, GreeterState> {
 *   $newState() {
 *     return {} as GreeterState;
 *   }
 * }
 * ```
 * @public
 */
export class Component<PROPS, STATE> {
  /**
   * Pointer to template to verify that the component is attached to the right DOM location.
   */
  static $templateQRL: QRL = null!;

  /**
   * Component's host element.
   *
   * See HOST_ELEMENT.md for details
   */
  $host: Element;

  /**
   * Components serializable state.
   *
   * When application is de-hydrated only the component's state is serialized. For this reason
   * the state needs to contain all of the information necessary to rebuild the component.
   *
   * IMPORTANT: State must be JSON serializable!
   */
  $state: STATE;

  /**
   * Component's `Props`.
   *
   * Component is declared in the DOM like so `<MyComponent propA="valueA" ...>`. The attributes of
   * the component are it's properties and get converted int `Props` which is stored in this
   * property for convenience.
   */
  $props: PROPS;

  constructor(hostElement: Element, props: PROPS, state: STATE | null) {
    this.$host = hostElement;
    this.$props = props;
    this.$state = state!;
  }

  /**
   * Lifecycle method invoked on hydration.
   *
   * After the service creation and after the state is restored (either from DOM or by invoking
   * `$newState`) this method is invoked. The purpose of this method is to allow the service
   * to compute any transient state.
   *
   * Lifecycle order:
   * - `new Component(...)`
   * - `$newState(props)`: Invoked if no serialized state found in DOM.
   * - `$init()`
   * - Service returned by the `Injector`.
   */
  $init(): Promise<void> | void {}

  /**
   * Lifecycle method to initialize component's state.
   *
   * When component is first created it has no state. Use this method to create initial component's
   * state. Once the component's state gets serialized to HTML and the component gets rehydrate
   * this method is no longer called.
   *
   * Lifecycle order:
   * - `new Component(...)`
   * - `$newState(props)`: Invoked if no serialized state found in DOM.
   * - `$init()`
   * - Service returned by the `Injector`.
   *
   * @param props - Component props.
   */
  $newState(props: PROPS): Promise<STATE> | STATE {
    const componentType = this.constructor as typeof Component;
    throw qError(QError.Component_noState_component_props, componentType, props);
  }
}

// TODO: Docs
/**
 * @public
 */
export type ComponentStateOf<SERVICE extends Component<any, any>> = SERVICE extends Component<
  any,
  infer STATE
>
  ? STATE
  : never;

// TODO: Docs
/**
 * @public
 */
export type ComponentPropsOf<SERVICE extends Component<any, any>> = SERVICE extends Component<
  infer PROPS,
  any
>
  ? PROPS
  : never;

/**
 * Component Constructor.
 * @public
 */
export interface ComponentConstructor<COMP extends Component<any, any>> {
  $templateQRL: QRL;
  new (
    hostElement: Element,
    props: ComponentPropsOf<COMP>,
    state: ComponentStateOf<COMP> | null
  ): COMP;
}