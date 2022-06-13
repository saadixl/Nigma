import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function GenerateDigitDropdown(props) {
    const { onChange, value } = props;
    let options = [];
    for(let i = 0; i <= 26; i++) {
        const comp = <option value={i}>{i}</option>;
        options.push(comp);
    }
    return (<select onChange={(e) => {
        onChange(e.target.value)
    }} value={value} className="form-control">
        {options}
    </select>);
}

function RotorModal(props) {
    const { show, onHide, getRotorCode } = props;
    const [rotorCode, setRotorCode] = useState({
        d0: 1,
        d1: 1,
        d2: 1,
    });

    function updateDigit(id, val) {
        setRotorCode({
            ...rotorCode,
            [id]: val
        });
    }

    function sendRotorCode() {
        const { d0, d1, d2 } = rotorCode;
        let rotorCodeStr = `${d0}-${d1}-${d2}`;
        getRotorCode(rotorCodeStr);
        onHide();
    }

    return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Set your enigma rotor code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="rotor-modal">
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d0', val) }} value={rotorCode.d0} />
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d1', val) }} value={rotorCode.d1} />
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d2', val) }} value={rotorCode.d2} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={sendRotorCode}>
            Apply
          </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default RotorModal;