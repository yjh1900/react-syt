
export type HospitalListRes ={
    records:HospitalList,
    total:number
}

export type HospitalList = HospitalItem[]

export interface HospitalItem {
  id: number
  createTime: string
  updateTime: string
  hosname: string
  hoscode: string
  apiUrl: string
  signKey: string
  contactsName: string
  contactsPhone: string
}
