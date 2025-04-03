const apiKey =  '';

const cityNames = ['adana', 'adıyaman', 'afyonkarahisar', 'ağrı',
    'amasya', 'ankara', 'antalya', 'artvin', 'aydın', 'balıkesir', 'bilecik',
    'bingöl', 'bitlis', 'bolu', 'burdur', 'bursa', 'çanakkale', 'çankırı',
    'çorum', 'denizli', 'diyarbakır', 'edirne', 'elazığ', 'erzincan', 'erzurum',
    'eskişehir', 'gaziantep', 'giresun', 'gümüşhane', 'hakkari', 'hatay', 'isparta',
    'mersin', 'istanbul', 'izmir', 'kars', 'kastamonu', 'kayseri', 'kırklareli', 'kırşehir',
    'kocaeli', 'konya', 'kütahya', 'malatya', 'manisa', 'kahramanmaraş', 'mardin', 'muğla',
    'muş', 'nevşehir', 'niğde', 'ordu', 'rize', 'sakarya', 'samsun', 'siirt', 'sinop', 'sivas',
    'tekirdağ', 'tokat', 'trabzon', 'tunceli', 'şanlıurfa', 'uşak', 'van', 'yozgat', 'zonguldak',
    'aksaray', 'bayburt', 'karaman', 'kırıkkale', 'batman', 'şırnak',
    'bartın', 'ardahan', 'iğdır', 'yalova', 'karabük', 'kilis', 'osmaniye', 'düzce']

export const getCityNames = cityNames
    .map((value,index) => ({value,index:index,temp:'-'}));

const formatDate = (date, isHour, isMinute, isSecond, isQuery) => {
    let year = date.getFullYear()
    let month = date.getMonth() +1
    let longMonth = date.toLocaleDateString('tr-TR', { month: 'long' });
    let day = date.getDate()
    let hour = isHour ?  isHour : date.getHours()
    let minute = isMinute ?  isMinute : date.getMinutes()
    let second = isSecond ?  isSecond : date.getSeconds();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    if(isQuery === 1) {
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        return `${year}-${month}-${day} ${hour}:${minute}`;
    } // Now()
    if(isQuery === 2) { // Query()
        let HourPercent = hour % 3;
        HourPercent === 1 ? hour-- : HourPercent === 2 ? hour++ : hour;
        hour = hour < 10 ? '0' + hour : hour;
        return `${year}-${month}-${day} ${hour}:00:00`;
    }
    else return `${day} ${longMonth} ${year}`;  // Only Date()
}

export const getNowDay = (afterDay = 0, isHour, isMinute, isSecond, isQuery=1) => {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + afterDay);
        return formatDate(currentDate, isHour, isMinute, isSecond, isQuery);
}

export const getData = async (selectedIndex, isToday) => {
    const BASE_URL = `https://api.openweathermap.org/data/2.5/` + ((isToday) ? 'weather' : 'forecast')
        + `?q=${cityNames[selectedIndex].trim().toLowerCase()}&units=metric&appid=${apiKey}`;

    console.log(BASE_URL);
    try {
        const response = await fetch(BASE_URL);
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export const getTemp = (cities) => {
    cities.slice(0,cities.length).forEach( (city) => {
        getData(city?.index, apiKey, true).then(item => {
            // @ts-ignore
            city.temp = Math.round( item?.main?.temp) + ' ℃.'
        })
    } )
}