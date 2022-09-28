const formatUrl = (url, baseUrl, uriSize, avatarAuthURLFragment) => (
	`${ baseUrl }${ url }?format=png&size=${ uriSize }&${ avatarAuthURLFragment }`
);

export const avatarURL = ({
	type, text, size, userId, token, avatar, baseUrl
}) => {
	const room = type === 'd' ? text : `@${ text }`;

	// Avoid requesting several sizes by having only two sizes on cache
	const uriSize = size === 100 ? 100 : 50;

	let avatarAuthURLFragment = '';
	if (userId && token) {
		avatarAuthURLFragment = `&rc_token=${ token }&rc_uid=${ userId }`;
	}


	let uri;
	if (avatar) {
		uri = avatar.includes('http') ? avatar : formatUrl(avatar, baseUrl, uriSize, avatarAuthURLFragment);
	} else {
		uri = formatUrl(`/avatar/${ room }`, baseUrl, uriSize, avatarAuthURLFragment);
	}

	return uri;
};


import RocketChat from '../lib/rocketchat';

const canPost = async({ rid }) => {
	try {
		const permission = await RocketChat.hasPermission(['post-readonly'], rid);
		return permission && permission['post-readonly'];
	} catch {
		// do nothing
	}
	return false;
};

const isMuted = (room, user) => room && room.muted && room.muted.find && !!room.muted.find(m => m === user.username);

export const isReadOnly = async(room, user) => {
	if (room.archived) {
		return true;
	}
	const allowPost = await canPost(room);
	if (allowPost) {
		return false;
	}
	return (room && room.ro) || isMuted(room, user);
};

export const MessageTypeValues = [
	{
		value: 'uj',
		text: 'Message_HideType_uj'
	}, {
		value: 'ul',
		text: 'Message_HideType_ul'
	}, {
		value: 'ru',
		text: 'Message_HideType_ru'
	}, {
		value: 'au',
		text: 'Message_HideType_au'
	}, {
		value: 'mute_unmute',
		text: 'Message_HideType_mute_unmute'
	}, {
		value: 'r',
		text: 'Message_HideType_r'
	}, {
		value: 'ut',
		text: 'Message_HideType_ut'
	}, {
		value: 'wm',
		text: 'Message_HideType_wm'
	}, {
		value: 'rm',
		text: 'Message_HideType_rm'
	}, {
		value: 'subscription_role_added',
		text: 'Message_HideType_subscription_role_added'
	}, {
		value: 'subscription_role_removed',
		text: 'Message_HideType_subscription_role_removed'
	}, {
		value: 'room_archived',
		text: 'Message_HideType_room_archived'
	}, {
		value: 'room_unarchived',
		text: 'Message_HideType_room_unarchived'
	}
];

export const isNotch = NOTCH_DEVICES.includes(DeviceInfo.getModel());
export const isIOS = Platform.OS === 'ios';
export const isAndroid = !isIOS;
export const getReadableVersion = DeviceInfo.getReadableVersion();
export const getBundleId = DeviceInfo.getBundleId();
export const getDeviceModel = DeviceInfo.getModel();

// Theme is supported by system on iOS 13+ or Android 10+
export const supportSystemTheme = () => {
	const systemVersion = parseInt(DeviceInfo.getSystemVersion(), 10);
	return systemVersion >= (isIOS ? 13 : 10);
};

export const logServerVersion = (serverVersion) => {
	metadata = {
		serverVersion
	};
};

export default (e) => {
	if (e instanceof Error && !__DEV__) {
		bugsnag.notify(e, (report) => {
			report.metadata = {
				details: {
					...metadata
				}
			};
		});
	} else {
		console.log(e);
	}
};