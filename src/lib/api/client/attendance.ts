import { Client } from '#/lib/config'
import type { TBaseQueryParams, TPostApiResponse } from '#/lib/types'
import type {
  AttendanceBulkTransferPayload,
  AttendanceDevice,
  AttendanceDeviceCommandLogResponse,
  AttendanceDeviceParams,
  AttendanceDevicePayload,
  AttendanceDeviceTransactionDetailResponse,
  AttendanceDeviceTransactionResponse,
  AttendanceDeviceTypeResponse,
  AttendanceDeviceUserParams,
  AttendanceDeviceUserResponse,
  AttendanceUserTransferPayload,
  CreateAttendanceDevicePayload,
  TGetAttendanceDeviceByIdResponse,
  TGetAttendanceDeviceResponse,
} from '#/lib/types/api/attendance'
import { ENDPOINTS } from './endpoints'

const attendanceClient = {
  /**
   * Description - Fetch all devices
   * @param {AttendanceDeviceParams} params -
   * @returns {TGetAttendanceDeviceResponse} - data fetched from devices
   */
  devices: (params?: AttendanceDeviceParams) =>
    Client.get<TGetAttendanceDeviceResponse>(ENDPOINTS.attendanceDevices, {
      params,
    }),

  /**
   * Description - Fetch a specific attendance device by ID
   * @param id - The ID of the attendance device
   * @returns {TGetAttendanceDeviceByIdResponse} - data fetched for the specific device
   */
  device: (id: number) =>
    Client.get<TGetAttendanceDeviceByIdResponse>(
      `${ENDPOINTS.attendanceDevices}/${id}`,
    ),
  /**
   * Description - Create a new attendance device
   * @param payload - The payload for creating the attendance device
   * @returns {TPostApiResponse<AttendanceDevice>} - data of the created device
   */
  createDevice: (payload: CreateAttendanceDevicePayload) =>
    Client.post<TPostApiResponse<AttendanceDevice>>(
      ENDPOINTS.attendanceDevices,
      payload,
    ),

  /**
   * Description - Update an existing attendance device
   * @param id - The ID of the attendance device to update
   * @param payload - The payload for updating the attendance device
   * @returns {TPostApiResponse<AttendanceDevice>} - data of the updated device
   */
  updateDevice: ({
    id,
    ...payload
  }: AttendanceDevicePayload & { id: number }) =>
    Client.put<TPostApiResponse<AttendanceDevice>>(
      `${ENDPOINTS.attendanceDevices}/${id}`,
      payload,
    ),

  /**
   * Description - Execute a command on attendance devices
   * @param payload - The payload containing the command type and devices
   * @returns {TPostApiResponse<unknown>} - response from the command execution
   */
  command: (payload: { command_type: 'reboot' | 'check'; devices: string[] }) =>
    Client.post<TPostApiResponse<unknown>>(
      `${ENDPOINTS.attendanceDevices}/commands`,
      payload,
    ),

  /**
   * Description - Transfer users between attendance devices
   * @param payload - The payload containing the transfer details
   * @returns {TPostApiResponse<unknown>} - response from the transfer execution
   */
  transfer: (payload: AttendanceUserTransferPayload) =>
    Client.post<TPostApiResponse<unknown>>(
      `${ENDPOINTS.attendanceUsersTransfer}`,
      payload,
    ),

  /**
   * Description - Bulk transfer users between attendance devices
   * @param payload - The payload containing the bulk transfer details
   * @returns {TPostApiResponse<unknown>} - response from the bulk transfer execution
   */
  bulkTransfer: (payload: AttendanceBulkTransferPayload) =>
    Client.post<TPostApiResponse<unknown>>(
      `${ENDPOINTS.attendanceUsersBulkTransfer}`,
      payload,
    ),

  /**
   * Description - Get the list of attendance device types
   * @returns {AttendanceResponse<AttendanceDeviceType[]>} - list of attendance device types
   */
  deviceTypes: () =>
    Client.get<AttendanceDeviceTypeResponse>(
      `${ENDPOINTS.attendanceDeviceTypes}`,
    ),

  /**
   * Description - Get the list of attendance device users
   * @param params - The query parameters for fetching device users
   * @returns {AttendanceDeviceUserResponse} - list of attendance device users
   */
  users: (params?: AttendanceDeviceUserParams) =>
    Client.get<AttendanceDeviceUserResponse>(
      `${ENDPOINTS.attendanceDeviceUsers}`,
      { params },
    ),

  /**
   * Description - Get the list of attendance device transactions
   * @param {TBaseQueryParams} params - The query parameters for fetching device transactions
   * @returns {AttendanceDeviceTransactionResponse} - list of attendance device transactions
   */
  transactions: (params: TBaseQueryParams) =>
    Client.get<AttendanceDeviceTransactionResponse>(
      `${ENDPOINTS.attendanceDeviceTransactions}`,
      { params },
    ),
  /**
   * Description - Get the details of a specific attendance device transaction
   * @param id - The ID of the transaction
   * @returns {AttendanceDeviceTransactionDetailResponse} - details of the attendance device transaction
   */
  transaction: (id: number) =>
    Client.get<AttendanceDeviceTransactionDetailResponse>(
      `${ENDPOINTS.attendanceDeviceTransactions}/${id}`,
    ),

  /**
   * Description - Get the commands for a specific attendance device transaction
   * @param id - The ID of the transaction
   * @param params - The query parameters for pagination
   * @returns {AttendanceResponse<AttendancePage<AttendanceDeviceCommandLog>>} - list of command logs for the transaction
   */
  transactionCommands: (
    id: number,
    params: { page: number; perPage: number },
  ) =>
    Client.get<AttendanceDeviceCommandLogResponse>(
      `${ENDPOINTS.attendanceDeviceTransactions}/${id}/commands`,
      { params },
    ),
}

export default attendanceClient
