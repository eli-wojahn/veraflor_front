import React, { useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactDOM from 'react-dom';
import { ClienteContext } from '@/contexts/client'; // Import your context
import CartModalContent from './CartModalContent'; // Import the new component
import styles from './CartModal.module.css';

const MySwal = withReactContent(Swal);

const CartModal = ({ product, onClose }) => {
  const { clienteId } = useContext(ClienteContext); // Access the context here

  useEffect(() => {
    MySwal.fire({
      html: '<div id="cart-modal-root"></div>',
      showConfirmButton: false,
      showCloseButton: true,
      closeButtonHtml: '<span class="close-button">&times;</span>',
      customClass: {
        container: styles.customSwalContainer,
        popup: styles.customSwalPopup,
        closeButton: styles.customSwalCloseButton,
      },
      didOpen: () => {
        ReactDOM.render(
          <CartModalContent
            product={product}
            clienteId={clienteId} // Pass clienteId as a prop
            onClose={() => {
              MySwal.close(); // Close the SweetAlert modal
              onClose();      // Call any additional onClose logic
            }}
          />,
          document.getElementById('cart-modal-root')
        );
      },
      willClose: () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('cart-modal-root'));
      },
    });
  }, [clienteId, onClose, product]);

  return null;
};

export default CartModal;
