import {useEffect, useState} from "react";
import { getCityNames, getData, getTemp} from "./api/weather.js";
import CityCard from "./components/CityCard.tsx";

interface WeatherData {
    selectedCity: number;
    cityDetails: {
        [key: string]: any;
    };
    cityToday: {
        [key: string]: any;
    };
}

const Weather = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [weatherData, setWeatherData] = useState <WeatherData | null>({
        selectedCity:0,
        cityDetails: {
        },
        cityToday:{

        }
    })

    const changeCity = (cityID:number) => {
        // @ts-ignore
        setWeatherData((prev) => ({
            ...prev,
            selectedCity:cityID,
        }));
    }


    useEffect(() => {
        try {
            setLoading(true)

            getCityNames.filter( (item,index)=> index< 7 ).forEach( (city:{value:string, index:number, temp:string}) => {

                getData(city?.index , true).then(item => {
                    // @ts-ignore
                    city.temp = Math.round( item?.main?.temp) + ' ℃.'
                })
            } )

            //today
            getData(weatherData?.selectedCity, true).then(item => {

                // @ts-ignore
                setWeatherData((prev) => ({
                    ...prev,
                    cityToday:[item],
                }))
            })
            //forecast
            getData(weatherData?.selectedCity, false).then(item => {
                // @ts-ignore
                setWeatherData((prev) => ({
                    ...prev,
                    cityDetails:[item],
                }))
            })
        }catch (e) {
            setError('hata')
        }
        finally {
            setLoading(false);
        }
    }, [weatherData?.selectedCity]);


    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    return (
        <div className="container">
            <CityCard
                cityNames={getCityNames}
                changeCity={(cityID:number) => changeCity(cityID)}
                getTemp={(cities:Array<object>) => getTemp(cities)}
                cityDetails={weatherData?.cityDetails}
                cityToday = {weatherData?.cityToday}
                selectedCity={weatherData?.selectedCity}
                 />
        </div>
    )
}
export default Weather
