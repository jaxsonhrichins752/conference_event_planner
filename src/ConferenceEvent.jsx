import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection }  from "./mealsSlice";
import PropTypes from 'prop-types';

const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const venueItems = useSelector((state) => state.venue);
    const avItems = useSelector((state) => state.av);
    const mealsItems = useSelector((state) => state.meals);
    const dispatch = useDispatch();
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;
    

    
    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };

    const handleAddToCart = (index) => {
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; 
        }
        dispatch(incrementQuantity(index));
      };
    
      const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index));
        }
      };
    const handleIncrementAvQuantity = (index) => {
      dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
      dispatch(decrementAvQuantity(index));
    };

    const handleMealSelection = (index) => {
       const item = mealsItems[index];
       if (item.selected && item.type === "mealForPeople") {
          const newNumberOfPeople = item.selected ? numberOfPeople : 0;
          dispatch(toggleMealSelection(index, newNumberOfPeople));
       }
        else {
          dispatch(toggleMealSelection(index, numberOfPeople));
        }
    };


    const getItemsFromTotalCost = () => {
        // 1. Initialize an empty array to hold all selected items.
        const items = [];

        // 2. Process Venue Items
        venueItems.forEach((item) => {
          // Check if the user has selected a quantity greater than zero for a venue item.
          if (item.quantity > 0) {
            // If so, add it to the list with a 'type' property to identify it as a venue item.
            items.push({ ...item, type: "venue" });
          }
        });

        // 3. Process AV (Add-on) Items
        avItems.forEach((item) => {
          // Check if the quantity is greater than zero.
          if (
            item.quantity > 0 &&
            // This second condition prevents adding the same item twice. It checks if an
            // item with the same name and 'av' type is already in the list.
            !items.some((i) => i.name === item.name && i.type === "av")
          ) {
            // If selected, add it to the list and label its type as 'av'.
            items.push({ ...item, type: "av" });
          }
        });

        // 4. Process Meal Items
        mealsItems.forEach((item) => {
          // For meals, selection is based on the 'selected' boolean flag, not quantity.
          if (item.selected) {
            // Create a new object for display, labeling its type as 'meals'.
            const itemForDisplay = { ...item, type: "meals" };
            
            // This check seems to be looking for a 'numberOfPeople' property on the original
            // meal item. However, based on your code, the number of people is stored in the
            // component's state, not on the meal item itself.
            if (item.numberOfPeople) {
              itemForDisplay.numberOfPeople = numberOfPeople;
            }
            
            // Add the selected meal to the list.
            items.push(itemForDisplay);
          }
        });

        // 5. Return the complete list of all selected items.
        return items;
      };
                
    const items = getItemsFromTotalCost();

    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
          venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        }
        else if (section === "av") {
          avItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        }
        else if (section === "meals") {
          mealsItems.forEach((item) => {
            if (item.selected) {
              totalCost += item.cost * numberOfPeople;
            }
          });
        }
        return totalCost;
      };
    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");

    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
      }
      const totalCosts = {
        venue: venueTotalCost,
        av: avTotalCost,
        meals: mealsTotalCost,
      };
    

    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
                {!showItems
                    ?
                    (
                        <div className="items-information">
                             <div id="venue" className="venue_container container_main">
        <div className="text">
 
          <h1>Venue Room Selection</h1>
        </div>
        <div className="venue_selection">
          {venueItems.map((item, index) => (
            <div className="venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>
     <div className="button_container">
        {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211;
          </button>
          <span className="selected_count">
            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
          </span>
          <button
            className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43;
          </button>
        </>
        ) : (
          <div className="button_container">
           <button
              className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
               &#8211;
            </button>
            <span className="selected_count">
              {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
            </span>
            <button
              className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
             &#43;
            </button>
            
            
          </div>
        )}
      </div>
            </div>
          ))}
        </div>
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>
      </div>

                            {/*Necessary Add-ons*/}
                            <div id="addons" className="venue_container container_main">


                                <div className="text">

                                    <h1> Add-ons Selection</h1>

                                </div>
                                <div className="addons_selection">
                                  {avItems.map((item, index) => (
                                    <div className="av_data venue_main" key={index}>
                                      <div className="img">
                                        <img src={item.img} alt={item.name} />
                                      </div>
                                      <div className="text">{item.name}</div>
                                      <div>${item.cost}</div>
                                        <div className="addons_btn">
                                          <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                          <span className="quantity-value"> {item.quantity} </span>
                                          <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                        </div>
                                    </div>
                                  ))}

                                </div>
                                <div className="total_cost">Total Cost: ${avTotalCost}</div>

                            </div>

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">

                                <div className="text">

                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">
                                  <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                  <input type ="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} min="1"
                                  />
                                </div>
                                <div className="meal_selection">
                                  {mealsItems.map((item, index) => (
                                    <div className="meal_item" key={index} style={{ padding: 15 }}>
                                      <div className="inner">
                                        <input type="checkbox" id={`meal_${index}`}
                                        checked={item.selected}
                                        onChange={() => handleMealSelection(index)}
                                        />
                                        <label htmlFor={`meal_${index}`}>{item.name}</label>
                                      </div>
                                      <div className="meal_cost"> ${item.cost} </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="total_cost">Total Cost: ${mealsTotalCost}</div>


                            </div>
                        </div>
                    ) : (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} numberOfPeople={numberOfPeople} />} />
                        </div>
                    )
                }




            </div>
        </>

    );
};

const ItemsDisplay = ({ items, numberOfPeople }) => {
  console.log(items);
  return <>
    <div className="display_box1">
      {items.length === 0 && <p>No items selected.</p>}
      <table className="table_item_data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit Cost</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${item.cost}</td>
              <td>
                {item.type === "meals" || item.numberOfPeople
                ? ` For ${numberOfPeople} people`
                : item.quantity}
              </td>
              <td>
                {item.type === "meals" || item.numberOfPeople
                  ? `$${item.cost * numberOfPeople}`
                  : `$${item.cost * item.quantity}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
};

ItemsDisplay.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  numberOfPeople: PropTypes.number.isRequired,
};

export default ConferenceEvent;