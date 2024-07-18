"use client";

import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faRotate, faTrash } from '@fortawesome/free-solid-svg-icons';

import Image from 'next/image';
import loader from "../../assets/loader/loader.gif";
import TypeIt from 'typeit';

const Contacts = ({ showmsg, setGetMsg, getmsg }) => {

    const typeRef = useRef(null);
    const [contacts, setContacts] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [loading, setLoading] = useState(false);

    const getContact = async () => {
        setLoading(true);

        try {
            const res = await axios.get("/api/contact/get");
            toast.success(res?.data?.message);
            setContacts(res?.data?.contacts);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message);
        }
    };

    useEffect(() => {
        if (getmsg) {
            getContact();
        }
        setTimeout(() => {
            setGetMsg(false);
        }, 1500);
    }, [getmsg]);

    useEffect(() => {
        getContact();
    }, [])

    const DeleteMessage = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete("/api/contact/delete", { data: { id } });
            toast.success(res?.data?.message);
            setContacts(res?.data?.contacts);
            getContact();
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message);
            setLoading(false);
        }
    };

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    function formatDate(date) {
        const formattedDate = new Date(date);
        const shortYear = formattedDate.getFullYear().toString().slice(-2);
        const formattedDateString = `${formattedDate.getDate()}-${formattedDate.getMonth() + 1}-${shortYear} ${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
        return formattedDateString;
    }

    useEffect(() => {
        if (loading) {
            TypingEffect();
        }
    }, [loading])

    const TypingEffect = () => {
        if (typeRef.current) {

            new TypeIt(typeRef.current, {
                strings: [
                    'Loading...',
                    'Fetching data...',
                    'Please wait...'
                ],
                speed: 50,
                deleteSpeed: 50,
                breakLines: false,
                loop: true,
            }).go();
        }
    }

    return (
        <>
            {showmsg && (<div className='flex bg-gray-800 w-full mx-auto justify-center flex-col md:px-6 px-1 py-6 lg:px-8 rounded-lg mb-5' >

                {loading ?
                    (<div className='flex justify-center'>
                        <span className='text-white text-2xl' ref={typeRef}></span>
                    </div>) : (<>
                        <div className='flex justify-between items-center my-5'>
                            <h3 className='text-gray-700 font-extrabold text-2xl'>Your Messages</h3>
                            <button className='text-red-500' onClick={getContact} >
                                <FontAwesomeIcon onClick={() => getContact()} icon={faRotate} /><span className='text-sm '>Reload</span>
                            </button>
                        </div>

                        <div className="hs-accordion-group">
                            {contacts && contacts.length > 0 ? (
                                contacts.map((item, index) => (
                                    <div
                                        key={item._id}
                                        className={`hs-accordion ${activeAccordion === index ? 'active' : ''} bg-white border border-transparent rounded-lg mb-2`}
                                    >
                                        <button
                                            className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
                                            aria-controls={`hs-basic-active-bordered-collapse-${item._id}`}
                                        >
                                            {item.message.slice(0, 15)}
                                            <div className="flex items-center">
                                                <FontAwesomeIcon className='border-2 px-1 text-green-500 rounded-full' onClick={() => toggleAccordion(index)} icon={activeAccordion === index ? faCaretDown : faCaretUp} />
                                                <FontAwesomeIcon className='border-2 p-1 text-red-500 rounded-full ml-5' onClick={() => DeleteMessage(item._id)} icon={faTrash} />
                                            </div>
                                        </button>
                                        <div
                                            id={`hs-basic-active-bordered-collapse-${item._id}`}
                                            className={`hs-accordion-content ${activeAccordion === index ? 'block' : 'hidden'} w-full overflow-hidden transition-[height] duration-300`}
                                            aria-labelledby={`hs-active-bordered-heading-${item._id}`}
                                        >
                                            <div className="pb-4 px-5">
                                                <p className="text-gray-800">{item.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <div className='bg-zinc-300 px-4 rounded-t-lg'>date -- {formatDate(item.contactdate)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white flex justify-center">
                                    <div className='bg-zinc-500 rounded-t-3xl py-2 px-8'>
                                        Nothing to show
                                    </div>
                                </div>
                            )}
                        </div>

                    </>)
                }
            </div>)
            }
        </>
    );
};

export default Contacts;
