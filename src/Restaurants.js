import { Card, Pagination, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Restaurants() {
    const location = useLocation();
    const [restaurants, setRestaurants] = useState(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const perPage = 10;

    useEffect(() => {
        let urlParams = new URLSearchParams(location.search);
        let borough = urlParams.get("borough");
        fetch(`https://vast-atoll-09483.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}${borough == null ? "" : "&borough=" + borough}`).then(res => res.json()).then(returned => {
            setRestaurants(returned);
        }).catch(err => {
            console.log(err);
        });
    }, [location, page])

    function previousPage() {
        if (page > 1) setPage(page - 1);
    }

    function nextPage() {
        setPage(page + 1);
    }

    if (restaurants == null) {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>Loading restaurants...</Card.Title>
                    </Card.Body>
                </Card>
            </>
        )
    }
    else if (restaurants.length === 0) {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>No restaurants Found</Card.Title>
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
                        <Card.Title>Restaurant List</Card.Title>
                        <Card.Text>
                            Full list of restaurants. Optionally sorted by borough
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Borough</th>
                            <th>Cuisine</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant, index) => (
                            <tr key={index} onClick={() => { navigate(`/restaurant/${restaurant._id}`) }}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address.building + ' ' + restaurant.address.street}</td>
                                <td>{restaurant.borough}</td>
                                <td>{restaurant.cuisine}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.Prev onClick={previousPage} />
                    <Pagination.Item>{page}</Pagination.Item>
                    <Pagination.Next onClick={nextPage} />
                </Pagination>
            </>
        );
    }




}
