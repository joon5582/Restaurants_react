import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardDeck } from 'react-bootstrap';
export default function Restaurant() {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    useEffect(() => {
        setLoading(true);
        fetch(`https://enigmatic-dusk-50864.herokuapp.com/api/restaurants/${id}`).then(res => res.json()).then(returned => {
            setLoading(false);
            if (returned.hasOwnProperty("_id")) {
                setRestaurant(returned);
            }
            else {
                setRestaurant(null)
            }
        }).catch(err => {
            console.log(err);
        });

    }, [id])
    if(loading){
        return(
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>Loading restaurant data...</Card.Title>
                    </Card.Body>
                </Card>
            </>
        )
    }
    else if (restaurant == null) {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>Unable to find Restaurant with id: {id}</Card.Title>
                    </Card.Body>
                </Card>
            </>
        )
    }
    
    else {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>{restaurant.name}</Card.Title>
                        <Card.Text>
                            {restaurant.address.building + ' ' + restaurant.address.street}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br />
                <MapContainer style={{ "height": "400px" }} center={[restaurant.address.coord[1], restaurant.address.coord[0]]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[restaurant.address.coord[1], restaurant.address.coord[0]]}></Marker>
                </MapContainer>
                <br />
                <h4>Ratings</h4>
                <hr />
                <CardDeck>
                    {restaurant.grades.map((element, index) => (
                        <Card key={index}>
                            <Card.Body>
                                <Card.Title>Grade: {element.grade}</Card.Title>
                                <Card.Text>
                                    Completed: {new Date(element.date).toLocaleDateString()}                                    
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </CardDeck>
            </>

        );
    }

}