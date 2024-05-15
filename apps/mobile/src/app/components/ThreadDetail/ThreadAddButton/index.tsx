import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import PlusIcon from '../../../../assets/svg/plus.svg'
export default function ThreadAddButton() {
  return (
    <TouchableHighlight>
      <View>
        <PlusIcon width={22} height={22} />
      </View>
    </TouchableHighlight>
  )
}
