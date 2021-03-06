import React from 'react'
import { View } from 'react-native'
import { Text, Icon } from 'react-native-ui-kitten'
import { useStyles } from '@berty-tech/styles'
import { CircleAvatar } from '../../shared-components/CircleAvatar'
import { messenger } from '@berty-tech/store'
import { Messenger } from '@berty-tech/hooks'
import palette from 'google-palette'
import Color from 'color'
import { SHA3 } from 'sha3'

const pal = palette('tol-rainbow', 256)

//
// Message => All messages (group/contact)
//

// Types
// Styles
const useStylesMessage = () => {
	const [{ margin, row, flex, text, padding }] = useStyles()
	return {
		isMeMessage: [row.item.bottom, { maxWidth: '90%' }],
		isOtherMessage: [row.item.top, { maxWidth: '90%' }],
		circleAvatar: [flex.tiny, margin.right.small, row.item.bottom],
		messageItem: [],
		personNameInGroup: text.size.tiny,
		dateMessage: text.size.tiny,
		dateMessageWithState: [padding.right.scale(5), text.size.tiny],
		stateMessageValue: [padding.left.scale(1.5), text.size.tiny],
	}
}

const formatTimestamp = (date: Date) => {
	const arr = date.toString().split(' ')
	const hours = arr[4].split(':')
	const hour = hours[0] + ':' + hours[1]
	return hour
}

export const Message: React.FC<{
	id: string
	convKind: '1to1' | 'multi'
	membersNames?: { [key: string]: string | undefined }
}> = ({ id, convKind, membersNames }) => {
	const message = Messenger.useGetMessage(id)
	const _styles = useStylesMessage()
	const [{ row, margin, padding, column, text, border, color }] = useStyles()
	if (!message) {
		return null
	}
	const isGroup = convKind === 'multi'
	const styleMsg = null
	const avatarUri = undefined
	let name
	let baseColor = color.blue
	if (message.type === messenger.AppMessageType.UserMessage) {
		if (message.memberPk && membersNames) {
			name = membersNames[message.memberPk]
		}
		const payload = message
		let msgTextColor, msgBackgroundColor, msgBorderColor
		if (convKind === '1to1') {
			msgTextColor = payload.isMe ? (payload.acknowledged ? color.white : color.blue) : color.blue
			msgBackgroundColor = payload.isMe
				? payload.acknowledged
					? color.blue
					: color.white
				: '#CED2FF99'
			msgBorderColor = payload.isMe && border.color.blue
		} else {
			if (!message.isMe && message.memberPk) {
				const h = new SHA3(256).update(message.memberPk).digest()
				baseColor = '#' + pal[h[0]]
			}
			msgTextColor = payload.isMe ? (payload.acknowledged ? color.white : baseColor) : baseColor
			msgBackgroundColor = payload.isMe
				? payload.acknowledged
					? baseColor
					: color.white
				: Color(baseColor).alpha(0.1)
			msgBorderColor = payload.isMe && { borderColor: baseColor }
		}

		return (
			<View
				style={[
					row.left,
					payload.isMe ? _styles.isMeMessage : _styles.isOtherMessage,
					padding.horizontal.medium,
					{ paddingTop: 2 },
				]}
			>
				{/*!payload.isMe && isGroup && (
					<CircleAvatar
						style={_styles.circleAvatar}
						avatarUri={avatarUri}
						withCircle={false}
						size={35}
					/>
				)*/}
				<View style={[column.top, _styles.messageItem]}>
					{!payload.isMe && isGroup && name && (
						<View style={[margin.left.small]}>
							<Text style={[text.bold.medium, _styles.personNameInGroup, { color: baseColor }]}>
								{name}
							</Text>
						</View>
					)}
					<View
						style={[
							padding.small,
							border.radius.top.medium,
							payload.isMe ? border.radius.left.medium : border.radius.right.medium,
							styleMsg,
							msgBorderColor,
							payload.isMe && border.scale(2),
							padding.horizontal.scale(payload.isMe ? 11 : 13),
							padding.vertical.scale(payload.isMe ? 7 : 9),
							{
								backgroundColor: msgBackgroundColor,
								alignSelf: payload.isMe ? 'flex-end' : 'flex-start',
							},
						]}
					>
						<Text
							style={[
								{
									color: msgTextColor,
									fontSize: 12,
									lineHeight: 17,
								},
							]}
						>
							{payload.body}
						</Text>
					</View>
					<View style={[payload.isMe && row.item.bottom]}>
						<View style={[row.left, { alignItems: 'center' }]}>
							<Text
								style={[
									text.color.grey,
									padding.right.scale(5),
									_styles.dateMessage,
									{ fontSize: 9 },
								]}
							>
								{formatTimestamp(new Date(payload.sentDate))}{' '}
							</Text>
							{payload.isMe && (
								<Icon
									name={payload.acknowledged ? 'navigation-2' : 'navigation-2-outline'}
									width={12}
									height={12}
									fill={color.blue}
								/>
							)}
							<Text
								style={[
									text.color.blue,
									padding.left.scale(2),
									_styles.dateMessage,
									{ fontSize: 10, lineHeight: 11, textAlignVertical: 'center' },
								]}
							>
								{payload.isMe ? (payload.acknowledged ? 'sent' : 'sending...') : ''}
							</Text>
						</View>
					</View>
				</View>
			</View>
		)
	} else if (message.type === messenger.AppMessageType.GroupInvitation) {
		return (
			<View
				style={[
					message.isMe ? row.right : row.left,
					padding.horizontal.medium,
					padding.vertical.medium,
				]}
			>
				<Text>
					{message.isMe ? `You invited X to ${message.name}` : `Y invited you to ${message.name}`}
				</Text>
			</View>
		)
	} else {
		return null
	}
}
