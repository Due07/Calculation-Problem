import Vue from 'vue';

export type TClass = (target: Function) => void;

export type TMethod = (
    target: Vue,
    key: string,
    descriptor: PropertyDescriptor,
) => void;
