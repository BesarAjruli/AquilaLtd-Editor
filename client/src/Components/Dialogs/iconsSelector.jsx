import { forwardRef, useEffect, useState } from "react"
import { Icon } from '@iconify-icon/react';

const IconsSelector = forwardRef(({addElement, sendIconName}, ref) => {
    const [iconsName, setIconsName] = useState([]);
    const [searchedIcons, setSearchedIcons] = useState([])

    useEffect(() => {
        const fetchIcons = async () => {
          try {
            const response = await fetch(`https://api.iconify.design/collection?prefix=mdi-light&pretty=1`);
            if (response.ok) {
              const data = await response.json();
              setIconsName(data.uncategorized || []);
            } else {
              console.error('Failed to fetch icons');
            }
          } catch (error) {
            console.error('Error fetching icons');
          }
        };
      
        fetchIcons();
      }, []);

      const searchIcon = (e) => {
        const value = e.target.value.trim()
        if(value !== ''){
            const filteredIcons = iconsName.filter(name => name.startsWith(value));
            setSearchedIcons(filteredIcons)    
        }else{
            setSearchedIcons([])
        }
        }

      return (
        <dialog ref={ref} className="iconSelectorDialog">
          <header>
            <input
              type="search"
              placeholder="Search icons name"
              onChange={(e) => searchIcon(e)}
            />
            <i onClick={() => ref.current.close()} className="close-icon" title='close'>✖</i>
          </header>
          <div>
            {(searchedIcons.length > 0 ? searchedIcons : iconsName).map((name, i) => (
              <div key={i} className="icon-container">
                <Icon className="iconsInSelector" icon={`mdi-light:${name}`} 
                onClick={() => {
                    addElement()
                    sendIconName(name)
                    }}/>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </dialog>
      );
})

export default IconsSelector