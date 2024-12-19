import { Multicall } from "./Multicall";
import type { MulticallRequestConfig } from "./types";
import { getProvider } from "lib/rpc";
import { Contract } from "ethers";
import { getContract } from "config/contracts";

export async function executeMulticallMainThread(chainId: number, requestConfig: MulticallRequestConfig) {
  console.log("[Multicall Debug] Executing multicall in main thread:", {
    chainId,
    requestConfig,
  });

  const provider = getProvider(undefined, chainId);
  const multicallContract = new Contract(getContract(chainId, "Multicall"), Multicall.abi, provider);

  try {
    const { data, success } = await multicallContract.aggregate(
      requestConfig.map((request) => [request.target, request.callData])
    );

    console.log("[Multicall Debug] Multicall response:", {
      success,
      data: data?.map(d => d.toString()),
    });

    return {
      success,
      data,
    };
  } catch (error) {
    console.error("[Multicall Debug] Multicall error:", error);
    throw error;
  }
}
