/* eslint-disable max-len */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Modalwindow from './Modal';
import style from './style.module.css';

export default function OffersForTheQuestion({ questionId, setRecipientId }) {
  const [offers, setOffers] = useState([]);
  const [elementClicked, setElementClicked] = useState(null);
  const [stylebtn, setStylebtn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState(0);
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

  const handelPay = async (offerId) => {
    const transaction = await fetch('http://localhost:4000/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        offerId,
      }),
    });
    if (transaction.ok) {
      setStylebtn(true);
    } else {
      console.log('failed transaction');
    }
  };

  const handleClickModal = (offerId) => {
    setCurrentOfferId(offerId);
    setShowModal(true);
  };
  const handleConfirm = () => {
    handelPay(currentOfferId);
    setShowModal(false);
  };
  const handleCancel = () => {
    setCurrentOfferId(0);
    setShowModal(false);
  };

  if (offers.length <= 0) { return (<div className={style.blockTitle} style={{ backgroundColor: 'grey' }}>No offers yet</div>); }
  return (
    <>
      <Modalwindow
        show={showModal}
        message="Are you sure you want to continue?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      />
      <div className={style.offersContainer}>

        <div className={style.blockTitle}>Help offered:</div>
        <ul className={style.offers}>
          {offers?.length && offers.map((of) => (
            <a key={of.id} href="dummy" onClick={(e) => handleOfferClick(of.id, of.expertId, e)}>
              <li className={style.offer}>
                {/* <img alt="upic" className={style.userpic} src={`${of.User.userpic}`} /> */}
                <Avatar
                  alt="Remy Sharp"
                  src={of.User.userpic || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                  sx={{ width: 30, height: 30 }}
                />
                <span className={style.userEmail}>{of.User.name}</span>
                <span className={style.userEmail}>{of.User.surname}</span>
                <span className={style.price}>{of.price}</span>

                {/* <button type="button" disabled={stylebtn} onClick={() => handelPay(of.id)} className={stylebtn ? 'solvedBtn' : 'solvedBtn greyBtn'}>Pay Expert</button> */}

                <button type="button" onClick={() => handleClickModal(of.id)} className={stylebtn ? 'solvedBtn' : 'solvedBtn greyBtn'}>Pay Expert</button>

              </li>
            </a>
          ))}
        </ul>
      </div>
    </>
  );
}
