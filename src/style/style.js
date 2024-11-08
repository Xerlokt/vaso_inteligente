import { StyleSheet } from 'react-native';

colors = {
    purpple: '#C172FF',
    darkPurpple: '#57148B',

    green: '#89E55E',
    darkGreen: '#277005',
    greenblue: '#A3F4FF',
    darkGreenblue: '#018B9E',
    yellow: '#FFDF6D',
    darkYellow: '#FFC908',
    red: '#F96F6F',
    darkRed: '#FD2121',
    blue: '#95D3FF',
    darkBlue: '#3DAEFF',

    text: '#2D2D2D',
    white: 'white'
}

fonts = {
    thin: 'KumbhSansThin',
    extraLight: 'KumbhSansExtraLight',
    light: 'KumbhSansLight',
    regular: 'KumbhSansRegular',
    medium: 'KumbhSansMedium',
    semiBold: 'KumbhSansSemiBold',
    bold: 'KumbhSansBold',
    extraBold: 'KumbhSansExtraBold',
    black: 'KumbhSansBlack',

    sizeTitle: 20,
    sizeText: 18
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff'
    },

    backgroundSky:{
        height: 200,
        width: '100%',
        position: 'absolute',
        resizeMode: 'cover',
        top: 0,
        left: 0
    },

    mainContent:{
        width: '100%',
        minHeight: 190,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
        marginTop: 200,
        backgroundColor: colors.white,
        paddingTop: 220
    },

    text: {
        fontFamily: fonts.regular,
        fontSize: fonts.sizeText
    },

    vaseStatus:{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50vw',
        top: '-20%'
    },

    plantBody:{
        height: 220,
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 1000,
        backgroundColor: colors.white,
        marginBottom: 20,
        elevation: 5,
        position: 'relative',
        borderWidth: 3, 
        borderColor: colors.purpple 
    },

    plantVideo:{
        width: '55%',
        aspectRatio: 2 / 3,
    },

    plantName:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },

    nameTitle:{
        fontFamily: fonts.medium,
        fontSize: fonts.sizeTitle,
        width: 'auto',
        color: colors.text
    },

    renameIconContainer:{
        position: 'absolute',
        right: -50
    },

    renameIcon:{
        height: 30,
        borderWidth: 0,
        resizeMode: 'contain',
        borderColor: 'transparent'
    },

    boxOfSpans:{
        paddingHorizontal: 65,
    },

    environmentStatus:{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 80,
        paddingHorizontal: 65,
        gap: 25
    },

    environmentStatusSection:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },

    environmentStatusTitle:{
        fontFamily: fonts.medium,
        fontSize: fonts.sizeTitle,
        color: colors.text
    },

    horizontalRow:{
        height: 3,
        width: 80,
        borderRadius: 100,
        backgroundColor: colors.purpple,
        marginBottom: 10
    },
    
    statusGroup:{
        display: 'flex',
        flexDirection: 'column',
        gap: 20
    },

    statusRow:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        gap: 15
    },

    statusIcon:{
        height: 25,
        width: 18,
        resizeMode: 'contain'
    },

    progressBar:{
        width: '100%',
        height: 14,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        borderRadius: 1000,
        backgroundColor: colors.white,
        marginTop: 5,
        marginBottom: 20,
        overflow: 'none',
        elevation: 2,
        overflow: 'hidden'
    },

    progressValue:{
        height: 60,
        resizeMode: 'cover'
    },

    energyLvl:{
        marginTop: 30
    }
});
