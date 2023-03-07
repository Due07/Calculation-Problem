import Vue from 'vue';

export type TClass = (target: Function) => void;

export type TMethod = (
    target: Vue,
    key: string,
    descriptor: PropertyDescriptor,
) => void;

export type TMethodCallBack = <T>(...args: any[T]) => (
    target: Vue,
    key: string,
    descriptor: PropertyDescriptor,
) => void;