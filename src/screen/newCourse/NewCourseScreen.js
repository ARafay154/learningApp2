import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, Button, CustomIcon, Input, Label, Pressable } from '../../components'
import { En } from '../../locales/En'
import { FIREBASE_COLLECTIONS, KEYBOARD_TYPE, SCREEN } from '../../enums/AppEnums'
import { useSelector } from 'react-redux'
import { showFlash } from '../../utils/MyUtils'
import { addDocument } from '../../services/FirebaseMethods'

const NewCourseScreen = (props) => {
    const { navigation } = props
    const { paid } = props?.route?.params
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [details, setDetails] = useState('')
    const [objText, setObjText] = useState('')
    const [objective, setObjective] = useState([])
    const user = useSelector(({ appReducer }) => appReducer.user);

    const HandleCreateCourse = async () => {

        if (paid) {

            if (!title) {
                showFlash(En.entertitle, 'error')
                return;
            }
            if (!details) {
                showFlash(En.enterDetails, 'error')
                return;
            }
            if (objective.length === 0) {
                showFlash(En.enterObjective, 'error')
                return;
            }
            if (!price) {
                showFlash(En.enterPrice, 'error')
                return;
            }
            try {
                setLoading(true)
                const data = {
                    title: title,
                    paid: paid,
                    price: price,
                    details: details,
                    objective: objective,
                    createdBy: user?.uid,
                }
                await addDocument(FIREBASE_COLLECTIONS.COURSES, data)
                showFlash(En.courseAdded)
                setPrice('')
                setTitle('')
                setDetails('')
                setObjective([]);
                navigation.navigate(SCREEN.ONLINE_COURSES)
            } catch (error) {
                showFlash(En.somethingWrong)
                setLoading(false)
            } finally {
                setLoading(false)

            }
        } else {

            if (!title) {
                showFlash(En.entertitle, 'error')
                return;
            }
            if (!details) {
                showFlash(En.enterDetails, 'error')
                return;
            }
            if (objective.length === 0) {
                showFlash(En.enterObjective, 'error')
                return;
            }
            try {
                setLoading(true)
                const data = {
                    title: title,
                    paid: paid,
                    details: details,
                    objective: objective,
                    createdBy: user?.uid,
                }
                await addDocument(FIREBASE_COLLECTIONS.COURSES, data)
                showFlash(En.courseAdded)
                setTitle('')
                setDetails('')
                setObjective([]);
                navigation.navigate(SCREEN.OFFLINE_COURSES)
            } catch (error) {
                showFlash(En.somethingWrong)
                setLoading(false)
            } finally {
                setLoading(false)

            }
        }
    }

    const handleDeleteAnswer = (index) => {
        setObjective(prevObj => prevObj.filter((_, i) => i !== index));
      };

    const handleObjective = () => {
        Keyboard.dismiss()
        if (!objText) {
            showFlash("Write Objective first!")
            return;
        }
        setObjective([...objective, objText])
        setObjText('')
    }




    return (
        <View style={commonStyles.container}>
            <AppHeader
                leftComp={<BackBtn />}
                title={En.newCourse}
                style={styles.headerStyles}
            />


            <Input
                inputLabel={En.couseTitle}
                placeholder={En.writeHere}
                value={title}
                onChange={(e) => setTitle(e)}
            />

            <Input
                inputLabel={En.details}
                placeholder={En.writeHere}
                value={details}
                onChange={(e) => setDetails(e)}
            />

            <Input
                inputLabel={En.objective}
                placeholder={En.writeHere}
                value={objText}
                onChange={(e) => setObjText(e)}
                iconName="plus-circle"
                iconFamily="Feather"
                iconSize={hp(4)}
                iconPress={() => handleObjective()}
            />

            {
                objective.map((item, index) => (
                    <View key={index} style={[commonStyles.justifyView,{marginVertical:hp(0.5)}]}>
                        <Label style={styles.objectivetext} key={index}>{index + 1}. {item}</Label>
                        <Pressable onPress={() => handleDeleteAnswer(index)}>
                            <CustomIcon name="close" family="AntDesign" size={hp(3)} />
                        </Pressable>
                    </View>

                ))
            }

            {
                paid ?
                    <Input
                        inputLabel={En.coursePrice}
                        placeholder={En.writeHere}
                        keyboard={KEYBOARD_TYPE.NUMERIC}
                        value={price}
                        onChange={(e) => setPrice(e)}
                    />
                    :
                    null
            }

            <Button
                text={En.create}
                style={styles.btnStyle}
                onPress={() => HandleCreateCourse()}
                isLoading={loading}
            />
        </View>
    )
}

export default NewCourseScreen

const styles = StyleSheet.create({
    headerStyles: {
        marginBottom: hp(2)
    },
    btnStyle: {
        marginTop: hp(4)
    },
    objectivetext: {
        ...TEXT_STYLE.textSemiBold,
        color:COLOR.purple,
        marginVertical: hp(0.5),
        paddingHorizontal: wp(4)
    }
})