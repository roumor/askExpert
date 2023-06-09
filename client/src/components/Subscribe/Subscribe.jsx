/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Table } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import styles from './Subscribe.module.css';

export default function Subscribe() {
  const [offer, setOffer] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:4000/subscribe', {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const result = await response.json();
        setOffer(result);
      }
    })();
  }, []);

  if (!offer?.length) {
    return (<div />);
  }

  return (
    <>
      <div className={styles.subscribedOffer}>My offers</div>
      <table className={styles.tablesubscribe}>
        <thead>
          <tr>
            <th>Question by</th>
            <th>Tags</th>
            <th>Question</th>
            <th>Offer Price</th>
          </tr>
        </thead>
        <tbody>
          {offer?.length && offer?.map((el) => (
            <tr key={el.id}>
              <td>
                {el.Question.User.name}
                {' '}
                {el.Question.User.surname}
              </td>
              <td>{el.Question.Subjects.map((s) => <span key={s.id} className={styles.tag}>{s.title}</span>)}</td>
              <td>
                <Link to={`/question/${el.Question.id}`}>
                  {el.Question.title}
                </Link>
              </td>
              <td>{el.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  );
}
