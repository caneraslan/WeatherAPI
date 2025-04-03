import {useState, useEffect} from "react";
import {getNowDay} from "../api/weather.js";
import windDirection from '../assets/winddirection.svg';
import airPressure from '../assets/pressure.png'
import humidity from '../assets/humidity.svg'
import visibility from '../assets/visibility.svg'

interface props {
    cityNames: Array<object>,
    cityDetails: Array<object>,
    cityToday: Array<object>,
    selectedCity?: number,
    changeCity(cityID: number): void,
    getTemp(cities: Array<object>): number
}

const CityCard = ({cityNames, cityDetails, cityToday, changeCity, getTemp}: props) => {

    const [searchLists, setSearchLists] = useState(cityNames);
    const [time, setTime] = useState(getNowDay(0, null, null, null, 1));

    console.log(cityDetails[0]);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getNowDay(0, null, null, null, 1));
        }, 20000)

        return () => clearInterval(interval);
    }, [])

    const searchCity = (e: Event, searchValue: string) => {
        e.preventDefault();
        if (searchValue.trim().length > 0) {
            const newSearchList = cityNames.filter(
                (item: { value: string }) => {
                    return item.value.trim().toLowerCase().includes(searchValue.trim().toLowerCase());
                })
            getTemp(newSearchList);
            setSearchLists(newSearchList);
        } else {
            const newSearchList = cityNames.filter((item, index) => index < 7)
            getTemp(newSearchList);
            setSearchLists(newSearchList);
        }
    }

    const afterDayAreas = Array.from({length: 5}).map((_, index) => {
        const item = cityDetails[0]?.list?.filter(i => i?.dt_txt === getNowDay(index + 1, null, null, null, 2))?.at(0);

        return item ? (<button className='flex-fill list-group-item text-left' key={index}>
                    { getNowDay(index + 1, null, null, null, 3) + ' ->'}  Hissedilen: { Math.round(item?.main?.temp) } ℃. {item?.weather[0].description.charAt(0).toUpperCase() + item?.weather[0].description.slice(1) }

                </button>)
                : null;
        }
    )

    return (
        <div className="row p-4">
            <div className='col-3'>

                {/* Search area */}
                <form onSubmit={(e => searchCity(e))}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Bir şehir giriniz"
                               onChange={(e) => {
                                   searchCity(e, e.target.value)
                               }}/>
                        <button className="btn btn-outline-secondary" type="submit" > Ara </button>
                    </div>
                </form>

                {/* Cities area */}
                <div className="list-group">
                    {    // @ts-ignore
                        searchLists.slice(0, 6).map((item: { value: string, temp: string, index: number }) => (
                            <a href="#" key={item.index} className="list-group-item list-group-item-action"
                               aria-current="true" onClick={() => changeCity(item.index)}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{item.value}</h5>
                                </div>
                                <p className="mb-1"> Sicaklik Degeri: {
                                    item.temp
                                }</p>
                            </a>
                        ))}
                </div>
            </div>

            {/* The city Tab*/}
            <div className='col-8'>
                <div className="d-flex flex-column mb-2">
                    <div className="d-flex p-1  align-items-center justify-content-center">
                        <h3 className="display-6">{cityDetails[0]?.city?.name.split(" ")[0]} </h3></div>
                    <div className="d-flex justify-content-between">
                        <div className=''>
                            Hissedilen Sıcaklık {Math.round(cityToday[0]?.main?.feels_like)} ℃. { cityToday[0]?.weather[0]?.description.charAt(0).toUpperCase() + cityToday[0]?.weather[0]?.description.slice(1) }
                        </div>
                        <div className=''>{time}</div>
                    </div>
                </div>
                <div className='d-flex flex-row mb-3 '>
                    <div
                        className='d-flex box border border-3 w-30 p-2   align-items-center justify-content-right'>
                        <img className='rounded mx-auto d-block' alt="Hava durumu"
                             src={"https://openweathermap.org/img/wn/" + cityToday[0]?.weather[0]?.icon + '@2x.png'}></img>
                        <h4>{Math.round(cityToday[0]?.main?.temp)}℃</h4>
                    </div>

                    <table
                        className='d-flex flex-fill box border rounded-3 w-60 p-2   align-items-center justify-content-center'>
                        <tbody>
                        <tr>
                            <td>
                                <img alt='wind-symbol' src={windDirection} style={{
                                    transform: `rotate(${cityToday[0]?.wind?.deg}deg)`,
                                    width: '15px',
                                    height: '15px'
                                }}/> {' ' + cityToday[0]?.wind?.speed + ' m/s  '}

                            </td>
                            <td className='pl-2'><img alt='air-symbol' src={airPressure} style={{
                                width: '20px',
                                height: '20px'
                            }}/> {' ' + cityToday[0]?.main?.pressure + ' Pa'}

                            </td>

                            <td className='pl-2'>
                                <img alt='humidity-symbol' src={humidity} style={{
                                    width: '20px',
                                    height: '20px'
                                }}/>
                                {' %' + cityToday[0]?.main?.humidity}
                            </td>
                            <td className='pl-2'>
                                <img alt='visibilty-symbol' src={visibility} style={{
                                    width: '20px',
                                    height: '20px'
                                }}/>
                                {' ' + ((cityToday[0]?.visibility) / 1000) + ' km'}
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>

                <div className='d-flex flex-row mb-2 p-2'>
                    <ul className='d-flex flex-fill list-group list-group-horizontal'>
                        {afterDayAreas}
                    </ul>
                </div>
            </div>
        </div>
    )
}


export default CityCard
