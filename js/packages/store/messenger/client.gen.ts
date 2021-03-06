import * as api from '@berty-tech/api'
import { PayloadAction, CaseReducer } from '@reduxjs/toolkit'

export type Commands<State> = {
	instanceShareableBertyID: CaseReducer<
		State,
		PayloadAction<{
			reset: boolean
			displayName: string
		}>
	>
	shareableBertyGroup: CaseReducer<
		State,
		PayloadAction<{
			groupPk: Uint8Array
			groupName: string
		}>
	>
	devShareInstanceBertyID: CaseReducer<
		State,
		PayloadAction<{
			reset: boolean
			displayName: string
		}>
	>
	parseDeepLink: CaseReducer<
		State,
		PayloadAction<{
			link: string
		}>
	>
	sendContactRequest: CaseReducer<
		State,
		PayloadAction<{
			bertyId: api.berty.messenger.v1.IBertyID
			metadata: Uint8Array
			ownMetadata: Uint8Array
		}>
	>
	sendMessage: CaseReducer<
		State,
		PayloadAction<{
			groupPk: Uint8Array
			message: string
		}>
	>
	sendAck: CaseReducer<
		State,
		PayloadAction<{
			groupPk: Uint8Array
			messageId: Uint8Array
		}>
	>
	systemInfo: CaseReducer<State, PayloadAction<{}>>
}

export enum Methods {
	instanceShareableBertyID = 'instanceShareableBertyID',
	shareableBertyGroup = 'shareableBertyGroup',
	devShareInstanceBertyID = 'devShareInstanceBertyID',
	parseDeepLink = 'parseDeepLink',
	sendContactRequest = 'sendContactRequest',
	sendMessage = 'sendMessage',
	sendAck = 'sendAck',
	systemInfo = 'systemInfo',
}
