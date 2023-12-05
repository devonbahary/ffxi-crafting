import {
    FC,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { Synthesis } from '../interfaces';
import { NotificationsContext } from '../notifications/NotificationsProvider';
import { useGetSyntheses } from '../hooks/use-synthesis';

export interface ShoppingCartSynthesis {
    id: string;
    synthesis: Synthesis;
    asStack: boolean;
    quantity: number;
}

export interface ShoppingCartInterface {
    addToCart: (synthesis: Omit<ShoppingCartSynthesis, 'id'>) => void;
    clearCart: () => void;
    length: number;
    loading: boolean;
    refetchSyntheses: () => void;
    removeFromCart: (id: string) => void;
    shoppingCartSyntheses: ShoppingCartSynthesis[];
    totalProfit: number;
    updateQuantity: (id: string | number, quantity: number) => void;
}

export const AUCTION_HOUSE_ITEM_LIMIT = 21;

export const ShoppingCartContext = createContext<ShoppingCartInterface>(
    null as unknown as ShoppingCartInterface
);

const calcShoppingCartSynthesesLength = (
    shoppingCartSyntheses: ShoppingCartSynthesis[]
): number => {
    return shoppingCartSyntheses.reduce((acc, { quantity }) => {
        return acc + quantity;
    }, 0);
};

const calcShoppingCartTotalProfit = (
    shoppingCartSyntheses: ShoppingCartSynthesis[]
): number => {
    return shoppingCartSyntheses.reduce(
        (acc, { synthesis, quantity, asStack }) => {
            return (
                acc +
                quantity *
                    (asStack ? synthesis.stackProfit : synthesis.unitProfit)
            );
        },
        0
    );
};

export const ShoppingCartProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [shoppingCartSyntheses, setShoppingCartSyntheses] = useState<
        ShoppingCartSynthesis[]
    >([]);

    const { notifyError, notifySuccess } = useContext(NotificationsContext);

    const { loading, getSyntheses } = useGetSyntheses();

    const shoppingCartSynthesesLength = useMemo(
        () => calcShoppingCartSynthesesLength(shoppingCartSyntheses),
        [shoppingCartSyntheses]
    );

    const totalProfit = useMemo(
        () => calcShoppingCartTotalProfit(shoppingCartSyntheses),
        [shoppingCartSyntheses]
    );

    const addToCart = useCallback(
        (shoppingCartSynthesis: Omit<ShoppingCartSynthesis, 'id'>) => {
            if (
                shoppingCartSynthesesLength + shoppingCartSynthesis.quantity <=
                AUCTION_HOUSE_ITEM_LIMIT
            ) {
                const matchingSynthesisAndStackability =
                    shoppingCartSyntheses.find(({ synthesis, asStack }) => {
                        return (
                            synthesis.id ===
                                shoppingCartSynthesis.synthesis.id &&
                            asStack === shoppingCartSynthesis.asStack
                        );
                    });

                if (matchingSynthesisAndStackability) {
                    // increment quantity if synthesis already exists in shopping cart
                    setShoppingCartSyntheses((prev) =>
                        prev.map((s) =>
                            s.id === matchingSynthesisAndStackability.id
                                ? {
                                      ...s,
                                      quantity:
                                          s.quantity +
                                          shoppingCartSynthesis.quantity,
                                  }
                                : s
                        )
                    );
                } else {
                    setShoppingCartSyntheses((prev) => [
                        ...prev,
                        {
                            id: uuid(),
                            ...shoppingCartSynthesis,
                        },
                    ]);
                }

                notifySuccess(
                    `Added ${shoppingCartSynthesis.synthesis.product.name} to cart`
                );
            } else {
                notifyError(
                    `Cannot add ${shoppingCartSynthesis.synthesis.product.name} to cart: Auction House limit exceeded`
                );
            }
        },
        [
            notifyError,
            notifySuccess,
            shoppingCartSynthesesLength,
            shoppingCartSyntheses,
        ]
    );

    const removeFromCart = useCallback((id: string) => {
        setShoppingCartSyntheses((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setShoppingCartSyntheses([]);
    }, []);

    const updateQuantity = useCallback(
        (id: string | number, quantity: number) => {
            if (quantity > 0) {
                const shoppingCartSynthesis = shoppingCartSyntheses.find(
                    ({ id: existingId }) => id === existingId
                );

                if (shoppingCartSynthesis === undefined) {
                    notifyError(
                        `Cannot update quantity for shopping cart synthesis with id ${id}`
                    );
                    return;
                }

                if (
                    shoppingCartSynthesesLength -
                        shoppingCartSynthesis.quantity +
                        quantity >
                    AUCTION_HOUSE_ITEM_LIMIT
                ) {
                    notifyError(
                        `Cannot update quantity: Auction House limit exceeded`
                    );
                    return;
                }

                setShoppingCartSyntheses(
                    shoppingCartSyntheses.map((orig) =>
                        orig.id === id
                            ? {
                                  ...orig,
                                  quantity,
                              }
                            : orig
                    )
                );
            }
        },
        [notifyError, shoppingCartSyntheses, shoppingCartSynthesesLength]
    );

    const refetchSyntheses = useCallback(async () => {
        const synthesesIds = shoppingCartSyntheses.map(
            (shoppingCartSynthesis) => shoppingCartSynthesis.synthesis.id
        );

        const syntheses = await getSyntheses({
            ids: synthesesIds,
        });

        setShoppingCartSyntheses((prev) =>
            prev.map((shoppingCartSynthesis) => {
                const matchingSynthesis = syntheses.find(
                    (synth) => synth.id === shoppingCartSynthesis.synthesis.id
                );
                return {
                    ...shoppingCartSynthesis,
                    synthesis: matchingSynthesis
                        ? matchingSynthesis
                        : shoppingCartSynthesis.synthesis,
                };
            })
        );
    }, [shoppingCartSyntheses, getSyntheses]);

    const value: ShoppingCartInterface = useMemo(
        () => ({
            addToCart,
            clearCart,
            length: shoppingCartSynthesesLength,
            loading,
            refetchSyntheses,
            removeFromCart,
            shoppingCartSyntheses,
            updateQuantity,
            totalProfit,
        }),
        [
            addToCart,
            clearCart,
            loading,
            refetchSyntheses,
            removeFromCart,
            shoppingCartSyntheses,
            shoppingCartSynthesesLength,
            totalProfit,
            updateQuantity,
        ]
    );

    return (
        <ShoppingCartContext.Provider value={value}>
            {children}
        </ShoppingCartContext.Provider>
    );
};
