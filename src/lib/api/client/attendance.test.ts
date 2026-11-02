import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from '#/lib/config'
import attendanceClient from './attendance'

vi.mock('#/lib/config', () => ({
  Client: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}))

beforeEach(() => vi.clearAllMocks())

describe('attendance API contracts', () => {
  it('preserves the different pagination parameter names', async () => {
    await attendanceClient.devices({ page: 2, perPage: 10, state: 'offline' })
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/devices', {
      params: { page: 2, perPage: 10, state: 'offline' },
    })
    await attendanceClient.users({
      page: 2,
      per_page: 10,
      device_id: 7,
      search_query: 'Ada',
    })
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/devices/users', {
      params: { page: 2, per_page: 10, device_id: 7, search_query: 'Ada' },
    })
    await attendanceClient.devices()
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/devices')
  })

  it('sends create license but excludes the route ID from the update body', async () => {
    const payload = {
      branch_id: 4,
      device_type_id: 2,
      alias: 'Reception',
      serial_no: 'SN-100',
      timezone: '1',
    }
    await attendanceClient.createDevice({ ...payload, license: 'license' })
    expect(Client.post).toHaveBeenCalledWith('/attendance/devices', {
      ...payload,
      license: 'license',
    })
    await attendanceClient.updateDevice({ ...payload, id: 9 })
    expect(Client.put).toHaveBeenCalledWith('/attendance/devices/9', payload)
    await attendanceClient.device(9)
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/devices/9')
    await attendanceClient.deviceTypes()
    expect(Client.get).toHaveBeenLastCalledWith('/attendance/devices/types')
  })

  it.each(['reboot', 'check'] as const)(
    'queues %s using serial numbers',
    async (command_type) => {
      await attendanceClient.command({ command_type, devices: ['SN-100'] })
      expect(Client.post).toHaveBeenCalledWith('/attendance/devices/commands', {
        command_type,
        devices: ['SN-100'],
      })
    },
  )

  it('sends employee IDs and device serials to their respective transfer endpoints', async () => {
    const selected = {
      employees: [42],
      devices: ['SN-200'],
      command_type: 'USER_TRANSFER' as const,
      access: 'admin' as const,
    }
    await attendanceClient.transfer(selected)
    expect(Client.post).toHaveBeenCalledWith(
      '/attendance/devices/commands/users-transfer',
      selected,
    )
    const bulk = { device_from: 'SN-100', devices_to: ['SN-200'] }
    await attendanceClient.bulkTransfer(bulk)
    expect(Client.post).toHaveBeenLastCalledWith(
      '/attendance/devices/commands/users/bulk-transfer',
      bulk,
    )
  })

  it('loads transaction metadata and paginated commands separately', async () => {
    const params = { page: 3, perPage: 10 }
    await attendanceClient.transactions(params)
    expect(Client.get).toHaveBeenLastCalledWith(
      '/attendance/devices/transactions',
      { params },
    )
    await attendanceClient.transaction(18)
    expect(Client.get).toHaveBeenLastCalledWith(
      '/attendance/devices/transactions/18',
    )
    await attendanceClient.transactionCommands(18, params)
    expect(Client.get).toHaveBeenLastCalledWith(
      '/attendance/devices/transactions/18/commands',
      { params },
    )
  })

  it('propagates request failures', async () => {
    const error = new Error('Attendance service unavailable')
    vi.mocked(Client.post).mockRejectedValueOnce(error)
    await expect(
      attendanceClient.command({ command_type: 'reboot', devices: ['SN-100'] }),
    ).rejects.toBe(error)
  })
})
