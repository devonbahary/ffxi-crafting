import { Synthesis } from '../../interfaces';

export const getRepeatsToStack = (synth: Synthesis): number => {
    return parseInt(synth.product.stackSize) / synth.yield;
};
