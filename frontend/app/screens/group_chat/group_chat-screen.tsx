import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { GiftedChat } from "react-native-gifted-chat"
import { StackScreenProps } from "@react-navigation/stack"
import { Channel } from "twilio-chat"

import { color, spacing } from "../../theme"
import { TwilioService } from "../../services/chat"
import { TabNavigatorParamList } from "../../navigators"


const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  flexDirection: "column",
  flexGrow: 1,
}

const BUTTON_BACK: ViewStyle = {
  marginHorizontal: spacing[4],
}

const MESSAGE_CONTAINER: ViewStyle = {
  backgroundColor: color.background,
}


export const GroupChatScreen: FC<StackScreenProps<
  TabNavigatorParamList, "group_chat">> = observer(({ route, navigation }) => {

    const { channelId, identity } = route.params
    const [messages, setMessages] = useState([])
    const chatClientChannel = useRef<Channel>()
    const chatMessagesPaginator = useRef<any>()

    const setChannelEvents = useCallback((channel) => {
      chatClientChannel.current = channel
      chatClientChannel.current.on("messageAdded", (message) => {
        const newMessage = TwilioService.getInstance().parseMessage(message)
        setMessages((prevMessages) => [newMessage, ...prevMessages])
      })
      return chatClientChannel.current
    }, [])

    useEffect(() => {
      TwilioService.getInstance()
        .getChatClient()
        .then((client) => client.getChannelBySid(channelId.toString()))
        .then((channel) => setChannelEvents(channel))
        .then((currentChannel) => currentChannel.getMessages())
        .then((paginator) => {
          chatMessagesPaginator.current = paginator
          const newMessages = TwilioService.getInstance().parseMessages(paginator.items)
          setMessages(newMessages)
        })
        .catch((err) => console.log({ message: err.message, type: "danger" }))
    }, [channelId, setChannelEvents])

    const onSend = useCallback((newMessages = []) => {
      console.log("SENDING MESSAGE")
      const attributes = {
        giftedId: newMessages[0]._id,
        avatar: route.params.avatar,
      }
      chatClientChannel.current?.sendMessage(newMessages[0].text, attributes)
    }, [])

    const goBack = () => {
      navigation.navigate("group_details", { groupId: route.params.channelId })
    }

    const platformConf =
      Platform.OS === "ios"
        ? {
            minInputToolbarHeight: 40,
          }
        : {}

    return (
      <View style={ROOT}>
        <TouchableOpacity style={BUTTON_BACK} onPress={goBack}>
          <Icons size={35} name="keyboard-return" color={color.primary} />
        </TouchableOpacity>
        <GiftedChat
          messagesContainerStyle={MESSAGE_CONTAINER}
          messages={messages}
          renderAvatarOnTop
          onSend={(messages) => onSend(messages)}
          user={{ _id: identity }}
          {...platformConf}
        />
      </View>
    )
  },
)
