import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity, ScrollView } from "react-native"

import { Text, TextField, Icon } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TabNavigatorParamList } from "../../navigators"
import { MaterialIcons as Icons } from "@expo/vector-icons"
import { StackScreenProps } from "@react-navigation/stack"
import { useStores } from "../../models"

// <TouchableOpacity style={FILTER_BUTTON}>
// <Icons size={35} name='search' color={color.primary} />
// </TouchableOpacity>


const FULL: ViewStyle = {
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
}

const TEXT: TextStyle = {
  color: color.primary,
  fontFamily: typography.primary,
  fontSize: 13,
}

const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 26,
  textAlign: "center",
  color: color.textButton,
  backgroundColor: color.button,
  paddingVertical: spacing[3],
  fontFamily: typography.bold,
}

const FIELD_TITLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginTop: spacing[5],
  fontFamily: typography.bold,
}

const FILTERS: ViewStyle = {
  flexDirection: "row",
  alignContent: "stretch",
  justifyContent: "flex-start",
  marginTop: spacing[3],
  paddingBottom: spacing[5],
  borderBottomColor: color.primary,
  borderBottomWidth: 1,
}

const FILTER_BUTTON: TextStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginRight: spacing[8],
}

const IMAGE: ImageStyle = {
  width: 80,
  height: 80,
  marginRight: spacing[5],
  marginLeft: spacing[3],
}

const GROUP_ITEM: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[5],
  paddingBottom: spacing[5],
  borderBottomColor: color.primary,
  borderBottomWidth: 1,
}

const GROUP_NAME: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontFamily: typography.bold,
}

const GROUP_DESTINATION: TextStyle = {
  ...TEXT,
  fontSize: 14,
  marginTop: spacing[3],
}

const GROUP_FOOTER: ViewStyle = {
  ...TEXT,
  flexDirection: "row",
}

const GROUP_FOOTER_TEXT: TextStyle = {
  ...TEXT,
  marginTop: spacing[3],
  flex: 1,
  fontSize: 12,
}

export const SearchScreen: FC<StackScreenProps<TabNavigatorParamList, "search">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    const { groupStore } = useStores()

    const [search, setSearch] = useState("")

    const [groups, setGroups] = useState([])

    useEffect(() => {
      setGroups([
        {
          id: 1,
          name: "Grupo #1",
          destinationName: "Parada do shopping ABC",
          meetingTime: "08:00",
          usersCount: 5,
        },
        {
          id: 2,
          name: "Grupo #2",
          destinationName: "Parada do shopping DEF",
          meetingTime: "12:00",
          usersCount: 5,
        },
        {
          id: 3,
          name: "Grupo #3",
          destinationName: "Parada do shopping GHI",
          meetingTime: "18:00",
          usersCount: 5,
        },
      ])
    }, [])

    const searchGroups = async () => {
      const newGroups = await groupStore.searchGroups(search)
      setGroups(newGroups)
    }

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <View testID="SearchScreen" style={FULL}>
        <Text style={TITLE} text="ESTamos juntos" />

        <ScrollView style={CONTAINER}>
          <Text style={FIELD_TITLE}>Pesquisar por grupos</Text>
          <TextField
            value={search}
            onChangeText={setSearch}
            returnKeyType="go"
            blurOnSubmit={false}
            onSubmitEditing={searchGroups}
            placeholder="Inserir termos de busca..."
          />
          <View style={FILTERS}>
            <TouchableOpacity style={FILTER_BUTTON}>
              <Icons size={35} name="directions-walk" color={color.primary} />
              <Text style={TEXT} text="Caminhada" />
            </TouchableOpacity>
            <TouchableOpacity style={FILTER_BUTTON}>
              <Icons size={35} name="directions-car" color={color.primary} />
              <Text style={TEXT} text="Carona" />
            </TouchableOpacity>
          </View>

          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => {
                navigation.navigate("group_details", { groupId: group.id })
              }}
            >
              <View style={GROUP_ITEM}>
                <Icon icon="bug" style={IMAGE} />
                <View style={FULL}>
                  <Text style={GROUP_NAME}>{group.name}</Text>
                  <Text style={GROUP_DESTINATION}>{group.destinationName}</Text>
                  <View style={GROUP_FOOTER}>
                    <Text style={GROUP_FOOTER_TEXT}>{group.meetingTime}</Text>
                    <Text style={GROUP_FOOTER_TEXT}>{group.usersCount} pessoas</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  },
)
