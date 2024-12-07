import React, { useEffect, useContext, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createRoot } from 'react-dom/client'; 
import { ClienteContext } from '@/contexts/client'; 
import CartModalContent from './CartModalContent'; 
import styles from './CartModal.module.css';

const MySwal = withReactContent(Swal);

const CartModal = ({ product, onClose }) => {
  const { clienteId } = useContext(ClienteContext); 

  const rootRef = useRef(null);
  const containerRef = useRef(null);

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
        containerRef.current = document.getElementById('cart-modal-root');

        if (!rootRef.current) {
          rootRef.current = createRoot(containerRef.current);
        }

        rootRef.current.render(
          <CartModalContent
            product={product}
            clienteId={clienteId} 
            onClose={() => {
              MySwal.close(); 
              onClose();     
            }}
          />
        );
      },
      willClose: () => {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
        containerRef.current = null;
      },
    });
  }, [clienteId, onClose, product]);

  return null;
};

export default CartModal;
