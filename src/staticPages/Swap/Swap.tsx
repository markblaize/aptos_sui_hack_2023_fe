import React, {useState, useEffect} from 'react';
import {
    Box,
    Text,
    Grid,
    GridItem,
    Button,
    Flex,
    Select,
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';
import {HtmlMeta} from '@look/components';
import {Tab, TabList} from '@look/components/Tabs';
import {AptCoin} from '@look/components/Icons';
import {
    useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {ConnectWalletButton} from '../../layout/components/ConnectWalletButton';
import blockChainCore from "@utils/blockchain";
import {useStore} from "@utils/store";

export const Swap = () => {
    const [swapAmountIn, setSwapAmountIn] = useState<number>(0);
    const [swapAmountOut, setSwapAmountOut] = useState<number>(0);
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [symbolIn, setSymbolIn] = useState<string>("APT");
    const [symbolOut, setSymbolOut] = useState<string>("phApt");

    const assetSymbols = [...blockChainCore.getAssetSymbols(), "APT"];

    const wallet = useWallet();
    const store = useStore();

    const balanceIn = store.state.balances[symbolIn] || "0";
    const balanceOut = store.state.balances[symbolOut] || "0";

    const aptPrice = 5.09;
    const aptPrecision = Math.pow(10, 8);

    useEffect(() => {
        if (!!wallet.account && !!wallet.account.address)
            blockChainCore.UpdateInfo(store, wallet.account.address).catch(console.error);
    }, [wallet.connected, wallet.account]);

    const requestUpdateInfo = () => {
        setTimeout(() => {
            if (!!wallet.account && !!wallet.account.address)
                blockChainCore.UpdateInfo(store, wallet.account.address).catch(console.error);
        }, 3000)
    };

    const swap = async () => {
        if (symbolIn === symbolOut)
            return;
        let value = swapAmountIn * aptPrecision;
        console.log("value", value);
        if (symbolIn === "APT") {
            const tokenMetadata = await blockChainCore.getMetadata(symbolOut);
            console.log("tokenMetadata", tokenMetadata);
            const hash = await blockChainCore.getSwap().swapAssetForCoin(wallet, tokenMetadata, value);
            console.log("|hash", hash);
        } else {
            const tokenMetadata = await blockChainCore.getMetadata(symbolIn);
            console.log("tokenMetadata", tokenMetadata);
            const hash = await blockChainCore.getSwap().swapCoinForAsset(wallet, tokenMetadata, value);
            console.log("|hash", hash);
        }
        requestUpdateInfo();
    };

    const onChaneSwapAmount = (val) => {
        setSwapAmountIn(val.target.value);
    };

    const handleChangeSymbolIn = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSymbolIn(event.target.value)
    };
    const handleChangeSymbolOut = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSymbolOut(event.target.value)
    };

    const assetsOptions = [];
    assetSymbols.forEach((symbol) => {
        assetsOptions.push(
            <option value={symbol} key={symbol}>
                {symbol}
            </option>
        )
    });

    return (
        <Box>
            <HtmlMeta title="Swap"/>
            <Box as="section">
                <Grid templateColumns="1fr auto" gap="32px" alignItems="center" mb="40px">
                    <Box>
                        <Text as="h1" mb="24px">
                            Swap
                        </Text>
                        <Text color="gray" fontWeight={500}>
                            Tagline Will Goes Here
                        </Text>
                    </Box>
                    <ConnectWalletButton/>
                </Grid>
                <Box maxW="480px" m="0 auto">
                    <Box
                        borderRadius="24px 24px 24px 24px"
                        p="32px"
                        bgColor="blue.darkLight"
                        mb="2px"
                    >
                        <Flex
                            justifyContent="space-between"
                            fontWeight={700}
                            fontSize="12px"
                            letterSpacing="0.36px"
                            mb="12px"
                            color="gray"
                        >
                            <Text>${(aptPrice * swapAmountIn).toFixed(2)}</Text>
                            <Text>Balance: {balanceIn / aptPrecision}</Text>
                        </Flex>
                        <Flex
                            justifyContent="space-between"
                            fontFamily="orbitron"
                            fontSize="22px"
                            fontWeight={900}
                        >
                            <NumberInput defaultValue={0} precision={2} value={swapAmountIn}>
                                <NumberInputField
                                    p={0}
                                    border={0}
                                    outline="none"
                                    h="auto"
                                    boxShadow="none"
                                    fontFamily="orbitron"
                                    fontSize="22px"
                                    fontWeight={900}
                                    placeholder="0.00"
                                    _focus={{
                                        boxShadow: 'none',
                                    }}
                                    onChange={onChaneSwapAmount}
                                />
                            </NumberInput>
                            <Select
                                border={0}
                                borderRadius="16px"
                                fontWeight={500}
                                color="gray"
                                w="auto"
                                pr="10px"
                                value={symbolIn}
                                onChange={handleChangeSymbolIn}
                            >
                                {assetsOptions}
                            </Select>
                        </Flex>
                    </Box>
                    {/*< ----- >*/}
                    <Box
                        borderRadius="24px 24px 24px 24px"
                        p="32px"
                        bgColor="blue.darkLight"
                        mb="32px"
                    >
                        <Flex
                            justifyContent="space-between"
                            fontWeight={700}
                            fontSize="12px"
                            letterSpacing="0.36px"
                            mb="12px"
                            color="gray"
                        >
                            <Text>${(aptPrice * swapAmountIn).toFixed(2)}</Text>
                            <Text>Balance: {balanceOut / aptPrecision}</Text>
                        </Flex>
                        <Flex
                            justifyContent="space-between"
                            fontFamily="orbitron"
                            fontSize="22px"
                            fontWeight={900}
                        >
                            <NumberInput defaultValue={0} precision={2} value={swapAmountOut}>
                                <NumberInputField
                                    p={0}
                                    border={0}
                                    outline="none"
                                    h="auto"
                                    boxShadow="none"
                                    fontFamily="orbitron"
                                    fontSize="22px"
                                    fontWeight={900}
                                    placeholder="0.00"
                                    _focus={{
                                        boxShadow: 'none',
                                    }}
                                />
                            </NumberInput>
                            <Select
                                border={0}
                                borderRadius="16px"
                                fontWeight={500}
                                color="gray"
                                w="auto"
                                pr="10px"
                                value={symbolOut}
                                onChange={handleChangeSymbolOut}
                            >
                                {assetsOptions}
                            </Select>
                        </Flex>
                    </Box>
                    <Grid
                        templateColumns="1fr auto"
                        gap="24px"
                        fontSize="14px"
                        fontWeight={700}
                        mb="41px"
                    >
                        <GridItem>
                            <Text color="gray">{symbolIn} to {symbolOut} Rate</Text>
                        </GridItem>
                        <GridItem textAlign="right">
                            <Text>1 {symbolIn} = {exchangeRate} {symbolOut}</Text>
                        </GridItem>
                    </Grid>
                    <Flex justifyContent="center">
                        <Button onClick={swap}>Accept and Swap</Button>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};