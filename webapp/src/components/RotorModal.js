import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function GenerateDigitDropdown(props) {
    const { onChange, value } = props;
    let options = [];
    for(let i = 1; i <= 26; i++) {
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
    const { show, onHide, onRotorChange, onRotorReset } = props;
    const [rotorDigits, setRotorDigits] = useState({
        d0: 1,
        d1: 1,
        d2: 1,
    });

    function updateDigit(id, val) {
        setRotorDigits({
            ...rotorDigits,
            [id]: val
        });
    }

    function submit() {
        const { d0, d1, d2 } = rotorDigits;
        let rotorCode = `${d0}-${d1}-${d2}`;
        onRotorChange(rotorCode);
        onHide();
    }

    return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Set your enigma rotor code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="rotor-modal">
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d0', val) }} value={rotorDigits.d0} />
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d1', val) }} value={rotorDigits.d1} />
            <GenerateDigitDropdown onChange={(val) => { updateDigit('d2', val) }} value={rotorDigits.d2} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="danger" onClick={onRotorReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={submit}>
            Apply
          </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default RotorModal;