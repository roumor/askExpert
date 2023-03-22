/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';

export default function OffersForTheQuestion({ questionId, setRecipientId }) {
  const [offers, setOffers] = useState([]);
  const [elementClicked, setElementClicked] = useState(null);
  const [stylebtn, setStylebtn] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    (async () => {
      const response = await fetch(`http://localhost:4000/question/${questionId}/offers`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal,
      });

      const data = await response.json();
      setOffers(data);
    })();

    return () => abortController.abort();
  }, []);
  console.log(11, offers);

  const handleOfferClick = (id, expertId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setRecipientId(expertId);
    if (elementClicked) {
      elementClicked.style.backgroundColor = 'inherit';
      elementClicked.style.color = 'inherit';
    }
    e.target.style.backgroundColor = '#175792';
    e.target.style.color = 'white';
    setElementClicked(e.target);
  };
  // console.log(123, questionId);
  // console.log(1234, offers);
  const handelPay = () => {
    const id = [...offers].map((elem) => elem.id).join('');
    const expertId = [...offers].map((elem) => elem.expertId).join('');
    const price = [...offers].map((elem) => elem.price).join('');
    const offerId = [...offers].map((elem) => elem.id).join('');
    fetch('http://localhost:4000/payoffer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, expertId, price }),
    });
    fetch('http://localhost:4000/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id, expertId, price, questionId, offerId,
      }),
    });
    setStylebtn(true);
  };

  if (offers.length <= 0) { return (<div className={style.blockTitle} style={{ backgroundColor: 'grey' }}>No offers yet</div>); }
  return (
    <div className={style.offersContainer}>

      <div className={style.blockTitle}>Help offered:</div>
      <ul className={style.offers}>
        {offers?.length && offers.map((of) => (
          <a key={of.id} href="dummy" onClick={(e) => handleOfferClick(of.id, of.expertId, e)}>
            <li className={style.offer}>
              <img alt="upic" className={style.userpic} src={`../${of.User.userpic}`} />
              <span className={style.userEmail}>{of.User.name}</span>
              <span className={style.userEmail}>{of.User.surname}</span>
              <span className={style.price}>{of.price}</span>
              <button type="button" disabled={stylebtn} onClick={handelPay} className={stylebtn ? 'solvedBtn' : 'solvedBtn greyBtn'}>Pay Expert</button>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
}
