import type { Network, Account, Prices, Settings, Networks } from '@/extension/types'
import type { Ref } from 'vue'

const defaultSettings = {
    enableStorageEnctyption: false,
    encryptAfterEveryTx: false,
    lockOutEnabled: false,
    lockOutPeriod: 12e4,
    lockOutBlocked: false,
    theme: 'system',
    MP: ''
}

export const storageSave = async (key: string, value: any): Promise<void> =>{
    await chrome.storage.local.set({ [key]: value })
}

export const storageGet = async (key: string): Promise<{ [key: string]: any }> => {
    return await chrome.storage.local.get(key)
}

export const storageWipe = async (): Promise<void> => {
    await chrome.storage.local.clear()
}

export const getNetworks = async (): Promise<Networks> => {
    return (await storageGet('networks'))?.networks ?? {} as Networks
}

export const replaceNetworks = async (networks: Networks): Promise<void> => {
    await storageSave('networks', networks)
}

export const saveNetwork = async (network: Network): Promise<void> => {
    const saveNetworks = await getNetworks()
    saveNetworks[network.chainId] = network
    await storageSave('networks', saveNetworks)
}


export const getSelectedNetwork  = async (): Promise<Network > => {
    return (await storageGet('selectedNetwork'))?.selectedNetwork ?? null as unknown as Network 
}


export const saveSelectedNetwork  = async (selectedNetwork: Network ): Promise<void> => {
    await storageSave('selectedNetwork', selectedNetwork )
}


export const getAccounts = async (): Promise<Account[]> => {
    return (await storageGet('accounts')).accounts ?? [] as Account[]
}


export const saveAccount = async (account: Account): Promise<void> => {
    const savedAccounts = await getAccounts()
    await storageSave('accounts', [account, ...savedAccounts])
}

export const replaceAccounts = async (accounts: Account[]): Promise<void> => {
    await storageSave('accounts', accounts)
}

export const getSelectedAccount = async (): Promise<Account> => {
    return (await storageGet('selectedAccount'))?.selectedAccount ?? null as unknown as Account
}


export const saveSelectedAccount = async (selectedAccount: Account): Promise<void> => {
    await storageSave('selectedAccount', selectedAccount )
}

export const setPrices = async (prices: Prices): Promise<void> => {
    await storageSave('prices', prices )
}

export const getPrices = async (): Promise<Prices> => {
    return (await storageGet('prices'))?.prices ?? {} as unknown as Prices
}

export const getSettings = async (): Promise<Settings> => {
    return (await storageGet('settings'))?.settings ?? defaultSettings as unknown as Settings
}

export const setSettings = async (settings: Settings): Promise<void> => {
    await storageSave('settings', settings )
}

export const getBalanceCache = async (): Promise<string> => {
    return (await storageGet('balance'))?.balance ?? '0x0'
}

export const setBalanceCache = async (balance: string): Promise<void> => {
    await storageSave('balance', balance )
}

export const getRandomPk = () => {
    const array = new Uint32Array(10);
    crypto.getRandomValues(array)
    return array.reduce(
        (pv, cv) => `${pv}${cv.toString(16)}`,
        '0x'
    ).substring(0, 66)
}

export const smallRandomString = () => {
    return (Math.random() + 1).toString(36).substring(7);
}

export const clearPk = async (): Promise<void> => {
    let accounts = await getAccounts()
    const accProm = accounts.map(async a => {
      return a
    })
    accounts = await Promise.all(accProm)
    await replaceAccounts(accounts)
}

export const hexTostr = (hexStr: string) =>
 {  
    if(hexStr.substring(0,2) === '0x') {
        const chunks = [];
        const hexCodes = hexStr.substring(2)
    for (let i = 0, charsLength = hexCodes.length; i < charsLength; i += 2) {
    chunks.push(hexCodes.substring(i, i + 2));
    }
        return chunks.reduce(
            (pv, cv) => `${pv}${String.fromCharCode(parseInt(cv, 16))}`,
            ''
        ).substring(0, 66)
    }
    return hexStr
 }

export const numToHexStr = (num: number) => `0x${num.toString(16)}`

 export const copyAddress = async (address: string, toastRef: Ref<boolean>) => {
    await navigator.clipboard.writeText(address)
    toastRef.value = true
  }

export const getUrl = (url: string) => chrome.runtime.getURL(url)

export const paste = (id: string) => {
    const el = document.getElementById(id)
    if(el){
      el.focus();
      (document as any)?.execCommand('paste')
    }
}

export const openTab = (url: string) => {
    chrome.tabs.create({
        url
      });
}
